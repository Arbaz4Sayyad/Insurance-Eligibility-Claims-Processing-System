package com.his.ed.event;

import com.his.ed.service.EligibilityEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
public class DataCapturedEventListener {

    private static final Logger logger = LoggerFactory.getLogger(DataCapturedEventListener.class);

    @Autowired
    private EligibilityEngine engine;

    @Bean
    public Consumer<DataCapturedEvent> dataCaptured() {
        return event -> {
            logger.info("Received DataCapturedEvent for AppId: {}", event.getAppId());
            
            try {
                engine.determineEligibility(event.getAppId());
                logger.info("Automatically triggered Eligibility Determination for AppId: {}", event.getAppId());
            } catch (Exception e) {
                logger.error("Error triggering Eligibility Determination for AppId: {}: {}", event.getAppId(), e.getMessage());
                // In production, this might trigger a retry or DLQ action
            }
        };
    }
}
