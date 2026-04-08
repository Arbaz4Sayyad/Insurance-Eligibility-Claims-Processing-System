package com.his.ed;

import com.his.ed.model.PlanEntity;
import com.his.ed.model.RuleEntity;
import com.his.ed.repository.PlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class EdServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EdServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seeder(PlanRepository planRepository) {
        return args -> {
            if (planRepository.count() == 0) {
                // 1. SNAP Plan
                PlanEntity snap = PlanEntity.builder().name("SNAP").description("Supplemental Nutrition Assistance Program").active(true).build();
                RuleEntity snapRule = RuleEntity.builder().plan(snap).conditionExpression("totalIncome < 500").benefitAmount(350.0).denialReason("High Income").build();
                snap.setRules(List.of(snapRule));

                // 2. CCAP Plan
                PlanEntity ccap = PlanEntity.builder().name("CCAP").description("Child Care Assistance Program").active(true).build();
                RuleEntity ccapRule = RuleEntity.builder().plan(ccap).conditionExpression("hasChildren == true and age < 60").benefitAmount(250.0).denialReason("No Children or Age Mismatch").build();
                ccap.setRules(List.of(ccapRule));

                // 3. MedAid Plan
                PlanEntity medAid = PlanEntity.builder().name("MedAid").description("Medical Assistance").active(true).build();
                RuleEntity medRule = RuleEntity.builder().plan(medAid).conditionExpression("totalIncome < 1000").benefitAmount(400.0).denialReason("Income exceeds threshold").build();
                medAid.setRules(List.of(medRule));

                // 4. KW Plan
                PlanEntity kw = PlanEntity.builder().name("KW").description("Kentucky Works").active(true).build();
                RuleEntity kwRule = RuleEntity.builder().plan(kw).conditionExpression("householdSize > 2").benefitAmount(200.0).denialReason("Small Household").build();
                kw.setRules(List.of(kwRule));

                // 5. QHP Plan
                PlanEntity qhp = PlanEntity.builder().name("QHP").description("Qualified Health Plan").active(true).build();
                RuleEntity qhpRule = RuleEntity.builder().plan(qhp).conditionExpression("totalIncome > 200").benefitAmount(150.0).denialReason("Low Income or Not Qualified").build();
                qhp.setRules(List.of(qhpRule));

                planRepository.saveAll(List.of(snap, ccap, medAid, kw, qhp));
            }
        };
    }
}
