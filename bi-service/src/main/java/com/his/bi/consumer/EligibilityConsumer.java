package com.his.bi.consumer;

import com.his.bi.event.EligibilityDeterminedEvent;
import com.his.bi.service.BenefitService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
@Slf4j
public class EligibilityConsumer {

    @Autowired
    private BenefitService benefitService;

    @Bean
    public Consumer<EligibilityDeterminedEvent> eligibilityDetermined() {
        return event -> {
            log.info("Received EligibilityDeterminedEvent for App ID: {}. Status: {}", event.getAppId(), event.getStatus());
            try {
                benefitService.issueBenefit(event);
                log.info("Processed benefit account for App ID: {}", event.getAppId());
            } catch (Exception e) {
                log.error("Failed to process benefit for App ID: {}. Error: {}", event.getAppId(), e.getMessage());
            }
        };
    }
}
