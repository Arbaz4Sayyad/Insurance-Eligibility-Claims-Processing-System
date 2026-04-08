package com.his.ed.util;

import com.his.ed.model.PlanEntity;
import com.his.ed.model.RuleEntity;
import com.his.ed.repository.PlanRepository;
import com.his.ed.repository.RuleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DbInitializer implements CommandLineRunner {

    private final PlanRepository planRepository;
    private final RuleRepository ruleRepository;

    public DbInitializer(PlanRepository planRepository, RuleRepository ruleRepository) {
        this.planRepository = planRepository;
        this.ruleRepository = ruleRepository;
    }

    @Override
    public void run(String... args) {
        if (planRepository.count() == 0) {
            
            // 1. SNAP (Supplemental Nutrition Assistance Program)
            PlanEntity snap = PlanEntity.builder()
                    .name("SNAP")
                    .description("Supplemental Nutrition Assistance Program for low-income individuals.")
                    .active(true)
                    .build();
            planRepository.save(snap);
            ruleRepository.save(RuleEntity.builder()
                    .plan(snap)
                    .conditionExpression("totalIncome < 2500 && householdSize >= 1")
                    .benefitAmount(300.0)
                    .denialReason("Income exceeds threshold for SNAP.")
                    .build());

            // 2. Medicaid
            PlanEntity medicaid = PlanEntity.builder()
                    .name("Medicaid")
                    .description("Health coverage for individuals with limited income and resources.")
                    .active(true)
                    .build();
            planRepository.save(medicaid);
            ruleRepository.save(RuleEntity.builder()
                    .plan(medicaid)
                    .conditionExpression("totalIncome < 1500 && age < 65")
                    .benefitAmount(0.0) // Health coverage benefit is not a cash amount
                    .denialReason("Income too high or age requirement not met for Medicaid.")
                    .build());

            // 3. Medicare
            PlanEntity medicare = PlanEntity.builder()
                    .name("Medicare")
                    .description("Health insurance for people 65 or older.")
                    .active(true)
                    .build();
            planRepository.save(medicare);
            ruleRepository.save(RuleEntity.builder()
                    .plan(medicare)
                    .conditionExpression("age >= 65")
                    .benefitAmount(0.0)
                    .denialReason("Must be 65 or older for Medicare.")
                    .build());
        }
    }
}
