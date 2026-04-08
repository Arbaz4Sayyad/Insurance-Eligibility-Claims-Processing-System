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
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EligibilityEngine {

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

    public List<EligibilityResult> determineEligibility(Long appId) {
        
        // 1. Fetch AR and DC data
        ArClient.ArAppResponse arApp = arClient.getApplication(appId);
        DcClient.DcCaseResponse dcCase = dcClient.getCaseSummary(appId);

        // 2. Build CaseFact
        CaseFact fact = CaseFact.builder()
                .appId(appId)
                .age(Period.between(arApp.getCitizen().getDob(), LocalDate.now()).getYears())
                .gender(arApp.getCitizen().getGender())
                .totalIncome(dcCase.getIncomeRecords().stream().mapToDouble(DcClient.IncomeRecord::getAmount).sum())
                .householdSize(dcCase.getHouseholdMembers().size() + 1) // +1 for the applicant
                .hasChildren(dcCase.getHouseholdMembers().stream().anyMatch(m -> m.getRelationship().equalsIgnoreCase("CHILD")))
                .build();

        // 3. Evaluate Rules for all Active Plans
        List<PlanEntity> activePlans = planRepository.findByActiveTrue();
        List<EligibilityResult> results = new ArrayList<>();
        
        ExpressionParser parser = new SpelExpressionParser();
        StandardEvaluationContext context = new StandardEvaluationContext(fact);

        for (PlanEntity plan : activePlans) {
            boolean isEligible = false;
            Double benefitAmount = 0.0;
            String denialReason = null;

            for (RuleEntity rule : plan.getRules()) {
                Boolean match = parser.parseExpression(rule.getConditionExpression()).getValue(context, Boolean.class);
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
            String citizenName = arApp.getCitizen().getFirstName() + " " + arApp.getCitizen().getLastName();
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
}
