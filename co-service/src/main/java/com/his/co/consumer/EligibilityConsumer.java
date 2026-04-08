package com.his.co.consumer;

import com.his.co.event.EligibilityDeterminedEvent;
import com.his.co.service.PdfService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
@Slf4j
public class EligibilityConsumer {

    @Autowired
    private PdfService pdfService;

    @Bean
    public Consumer<EligibilityDeterminedEvent> eligibilityDetermined() {
        return event -> {
            log.info("Received EligibilityDeterminedEvent for App ID: {}", event.getAppId());
            try {
                pdfService.generateNotice(event);
                log.info("Successfully generated notice for App ID: {}", event.getAppId());
            } catch (Exception e) {
                log.error("Failed to generate notice for App ID: {}. Error: {}", event.getAppId(), e.getMessage());
            }
        };
    }
}
