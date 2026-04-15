package com.his.ed.service;

import com.his.ed.client.ArClient;
import com.his.ed.client.DcClient;
import com.his.ed.payload.response.ApiResponse;
import com.his.ed.model.EligibilityResult;
import com.his.ed.model.PlanEntity;
import com.his.ed.model.RuleEntity;
import com.his.ed.repository.EligibilityResultRepository;
import com.his.ed.repository.PlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.expression.spel.SpelEvaluationException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EligibilityEngineTest {

    @Mock
    private ArClient arClient;

    @Mock
    private DcClient dcClient;

    @Mock
    private PlanRepository planRepository;

    @Mock
    private EligibilityResultRepository resultRepository;

    @Mock
    private StreamBridge streamBridge;

    @InjectMocks
    private EligibilityEngine engine;

    private ArClient.ArAppResponse arApp;
    private DcClient.DcCaseResponse dcCase;
    private PlanEntity snapPlan;

    @BeforeEach
    void setUp() {
        // Setup AR Mock
        arApp = new ArClient.ArAppResponse();
        arApp.setId(1L);
        ArClient.Citizen citizen = new ArClient.Citizen();
        citizen.setFirstName("John");
        citizen.setLastName("Doe");
        citizen.setDob(LocalDate.now().minusYears(25));
        citizen.setGender("MALE");
        arApp.setCitizen(citizen);

        // Setup DC Mock
        dcCase = new DcClient.DcCaseResponse();
        dcCase.setAppId(1L);
        dcCase.setHouseholdMembers(Collections.emptyList());
        dcCase.setIncomeRecords(Collections.singletonList(new DcClient.IncomeRecord()));
        dcCase.getIncomeRecords().get(0).setAmount(500.0);

        // Setup Plan Mock
        RuleEntity rule = RuleEntity.builder()
                .conditionExpression("totalIncome < 1000")
                .benefitAmount(200.0)
                .build();
        
        snapPlan = PlanEntity.builder()
                .id(1L)
                .name("SNAP")
                .active(true)
                .rules(Collections.singletonList(rule))
                .build();
    }

    @Test
    void testDetermineEligibility_Approved() {
        when(arClient.getApplication(1L)).thenReturn(arApp);
        when(dcClient.getCaseSummary(1L)).thenReturn(dcCase);
        when(planRepository.findByActiveTrue()).thenReturn(Collections.singletonList(snapPlan));
        when(resultRepository.save(any(EligibilityResult.class))).thenAnswer(i -> i.getArguments()[0]);

        List<EligibilityResult> results = engine.determineEligibility(1L);

        assertEquals(1, results.size());
        assertEquals("APPROVED", results.get(0).getStatus());
        assertEquals(200.0, results.get(0).getBenefitAmount());
        verify(streamBridge).send(eq("eligibilityDetermined-out-0"), anyMap());
    }

    @Test
    void testDetermineEligibility_Rejected() {
        // Increase income to trigger rejection
        dcCase.getIncomeRecords().get(0).setAmount(2000.0);

        when(arClient.getApplication(1L)).thenReturn(arApp);
        when(dcClient.getCaseSummary(1L)).thenReturn(dcCase);
        when(planRepository.findByActiveTrue()).thenReturn(Collections.singletonList(snapPlan));
        when(resultRepository.save(any(EligibilityResult.class))).thenAnswer(i -> i.getArguments()[0]);

        List<EligibilityResult> results = engine.determineEligibility(1L);

        assertEquals("REJECTED", results.get(0).getStatus());
    }

    @Test
    void testSpelSandboxing_BlocksMaliciousExpression() {
        // Attempt to access System.getProperty via SpEL
        RuleEntity maliciousRule = RuleEntity.builder()
                .conditionExpression("T(java.lang.System).getProperty('os.name') != null") // This requires reflection (StandardEvaluationContext)
                .benefitAmount(500.0)
                .build();
        snapPlan.setRules(Collections.singletonList(maliciousRule));

        when(arClient.getApplication(1L)).thenReturn(arApp);
        when(dcClient.getCaseSummary(1L)).thenReturn(dcCase);
        when(planRepository.findByActiveTrue()).thenReturn(Collections.singletonList(snapPlan));

        // SimpleEvaluationContext should throw an exception or return null/fail for Type references
        assertThrows(SpelEvaluationException.class, () -> engine.determineEligibility(1L));
    }
}
