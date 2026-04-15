package com.his.ar.util;

import com.his.ar.model.PlanEntity;
import com.his.ar.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PlanRepository planRepository;

    @Override
    public void run(String... args) throws Exception {
        if (planRepository.count() == 0) {
            planRepository.save(PlanEntity.builder()
                    .name("Medical Assistance (MA)")
                    .category("Healthcare")
                    .status("Active")
                    .startDate(LocalDate.now().minusMonths(3))
                    .endDate(LocalDate.now().plusYears(1))
                    .members(4500L)
                    .build());

            planRepository.save(PlanEntity.builder()
                    .name("Food Support (SNAP)")
                    .category("Nutrition")
                    .status("Active")
                    .startDate(LocalDate.now().minusMonths(2))
                    .endDate(LocalDate.now().plusYears(1))
                    .members(3200L)
                    .build());

            planRepository.save(PlanEntity.builder()
                    .name("Cash Assistance (TANF)")
                    .category("Financial")
                    .status("Active")
                    .startDate(LocalDate.now().minusMonths(1))
                    .endDate(LocalDate.now().plusYears(1))
                    .members(1200L)
                    .build());
            
            planRepository.save(PlanEntity.builder()
                    .name("Housing Support")
                    .category("Housing")
                    .status("Active")
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusYears(2))
                    .members(500L)
                    .build());
        }
    }
}
