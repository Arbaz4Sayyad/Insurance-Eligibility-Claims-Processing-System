package com.his.ed.service;

import com.his.ed.client.ArClient;
import com.his.ed.client.DcClient;
import com.his.ed.model.EligibilityResult;
import com.his.ed.model.PlanEntity;
import com.his.ed.model.RuleEntity;
import com.his.ed.payload.dto.CaseFact;
import com.his.ed.repository.EligibilityResultRepository;
import com.his.ed.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EligibilityEngine {
    private static final Logger logger = LoggerFactory.getLogger(EligibilityEngine.class);

    @Autowired
    private ArClient arClient;

    @Autowired
    private DcClient dcClient;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private EligibilityResultRepository resultRepository;

    @Autowired
    private org.springframework.cloud.stream.function.StreamBridge streamBridge;

    private final Map<String, org.springframework.expression.Expression> expressionCache = new java.util.concurrent.ConcurrentHashMap<>();

    @CircuitBreaker(name = "edService", fallbackMethod = "fallbackDetermineEligibility")
    @Retry(name = "edService")
    public List<EligibilityResult> determineEligibility(Long appId) {
        // 0. Idempotency Check
        List<EligibilityResult> existingResults = resultRepository.findByAppId(appId);
        if (!existingResults.isEmpty()) {
            logger.info("Saga ID {}: Eligibility already determined. Returning existing records (Idempotency).", appId);
            return existingResults;
        }

        // 1. Fetch AR and DC data
        java.util.Map<String, Object> arApp = arClient.getApplication(appId).getData();
        java.util.Map<String, Object> dcCase = dcClient.getCaseSummary(appId).getData();

        // Extract AR data
        java.util.Map<String, Object> citizen = (java.util.Map<String, Object>) arApp.get("citizen");
        String dobStr = (String) citizen.get("dob");
        LocalDate dob = LocalDate.parse(dobStr);
        String gender = (String) citizen.get("gender");

        // Extract DC data
        java.util.List<java.util.Map<String, Object>> incomeRecords = (java.util.List<java.util.Map<String, Object>>) dcCase.get("incomeRecords");
        java.util.List<java.util.Map<String, Object>> householdMembers = (java.util.List<java.util.Map<String, Object>>) dcCase.get("householdMembers");

        // 2. Build CaseFact
         CaseFact fact = CaseFact.builder()
                .appId(appId)
                .age(Period.between(dob, LocalDate.now()).getYears())
                .gender(gender)
                .totalIncome(incomeRecords.stream().mapToDouble(m -> (Double) m.get("amount")).sum())
                .householdSize(householdMembers.size() + 1)
                .hasChildren(householdMembers.stream().anyMatch(m -> "CHILD".equalsIgnoreCase((String) m.get("relationship"))))
                .build();

        // 3. Evaluate Rules for all Active Plans
        List<PlanEntity> activePlans = planRepository.findByActiveTrue();
        List<EligibilityResult> results = new ArrayList<>();
        
        ExpressionParser parser = new SpelExpressionParser();
        // SECURE CONTEXT: Only allows property access on the root object (no methods, no constructors, no reflection access)
        org.springframework.expression.EvaluationContext context = 
            org.springframework.expression.spel.support.SimpleEvaluationContext
                .forReadOnlyDataBinding()
                .withRootObject(fact)
                .build();

        for (PlanEntity plan : activePlans) {
            boolean isEligible = false;
            Double benefitAmount = 0.0;
            String denialReason = null;

            for (RuleEntity rule : plan.getRules()) {
                String expressionStr = rule.getConditionExpression();
                
                // PERFORMANCE: Expression Caching
                org.springframework.expression.Expression expression = expressionCache.computeIfAbsent(expressionStr, parser::parseExpression);
                
                Boolean match = expression.getValue(context, Boolean.class);
                if (Boolean.TRUE.equals(match)) {
                    isEligible = true;
                    // For demo: benefit is rule's amount or a calculation
                    benefitAmount = rule.getBenefitAmount();
                    break; 
                } else {
                    denialReason = rule.getDenialReason();
                }
            }

            EligibilityResult result = EligibilityResult.builder()
                    .appId(appId)
                    .planName(plan.getName())
                    .status(isEligible ? "APPROVED" : "REJECTED")
                    .benefitAmount(isEligible ? benefitAmount : 0.0)
                    .denialReason(isEligible ? null : denialReason)
                    .determinedAt(LocalDateTime.now())
                    .build();

            results.add(resultRepository.save(result));

            // 4. Publish EligibilityDeterminedEvent to Kafka using a Map to simplify build
            String citizenName = (String) citizen.get("firstName") + " " + (String) citizen.get("lastName");
            Map<String, Object> event = new HashMap<>();
            event.put("appId", appId);
            event.put("citizenName", citizenName);
            event.put("planName", plan.getName());
            event.put("status", result.getStatus());
            event.put("benefitAmount", result.getBenefitAmount());
            event.put("denialReason", result.getDenialReason());
            
            streamBridge.send("eligibilityDetermined-out-0", event);
        }

        return results;
    }

    public List<EligibilityResult> fallbackDetermineEligibility(Long appId, Throwable t) {
        logger.error("Fallback triggered for appId {} due to: {}", appId, t.getMessage());
        // Return an empty list or a result with "PENDING" status
        EligibilityResult pending = EligibilityResult.builder()
                .appId(appId)
                .planName("ALL")
                .status("PENDING_REVIEW")
                .denialReason("Downstream services (AR/DC) unavailable. Determination delayed.")
                .determinedAt(LocalDateTime.now())
                .build();
        return Collections.singletonList(pending);
    }
}
