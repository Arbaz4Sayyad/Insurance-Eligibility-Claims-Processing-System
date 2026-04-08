package com.his.bi.event;

import com.his.bi.model.BenefitAccountEntity;
import com.his.bi.repository.BenefitAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Random;
import java.util.function.Consumer;

@Component
public class EligibilityEventListener {

    private static final Logger logger = LoggerFactory.getLogger(EligibilityEventListener.class);

    @Autowired
    private BenefitAccountRepository repository;

    @Bean
    public Consumer<EligibilityDeterminedEvent> eligibilityDetermined() {
        return event -> {
            logger.info("Received EligibilityDeterminedEvent for AppId: {}", event.getAppId());
            
            if ("APPROVED".equalsIgnoreCase(event.getStatus())) {
                
                // Check if account already exists (Idempotency)
                if (repository.findByAppId(event.getAppId()).isPresent()) {
                    logger.info("Benefit account already exists for AppId: {}", event.getAppId());
                    return;
                }

                String accountNumber = generateAccountNumber(event.getPlanName());

                BenefitAccountEntity account = BenefitAccountEntity.builder()
                        .appId(event.getAppId())
                        .planName(event.getPlanName())
                        .benefitAmount(event.getBenefitAmount())
                        .accountNumber(accountNumber)
                        .startDate(LocalDate.now().plusDays(1))
                        .endDate(LocalDate.now().plusMonths(12))
                        .status("ACTIVE")
                        .build();

                repository.save(account);
                logger.info("Benefit Account {} fully initialized for AppId: {}", accountNumber, event.getAppId());
            } else {
                logger.info("Application {} was REJECTED. No benefit account created.", event.getAppId());
            }
        };
    }

    private String generateAccountNumber(String planName) {
        Random random = new Random();
        if ("SNAP".equalsIgnoreCase(planName)) {
            // Mock 16-digit EBT Card
            return "6011" + (100000000000L + (long)(random.nextDouble() * 899999999999L));
        } else {
            // Mock Policy Number
            return "POL-" + planName.toUpperCase() + "-" + (100000 + random.nextInt(900000));
        }
    }
}
