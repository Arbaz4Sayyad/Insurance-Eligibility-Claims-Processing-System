package com.his.analytics.event;

import com.his.analytics.model.AnalyticsEntity;
import com.his.analytics.repository.AnalyticsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.function.Consumer;

@Component
public class KafkaEventListener {

    private static final Logger logger = LoggerFactory.getLogger(KafkaEventListener.class);

    @Autowired
    private AnalyticsRepository repository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Bean
    public Consumer<ApplicationCreatedEvent> applicationCreated() {
        return event -> {
            processEvent(event.getAppId(), "APP_CREATED", "New Application Registration Received");
        };
    }

    @Bean
    public Consumer<DataCapturedEvent> dataCaptured() {
        return event -> {
            processEvent(event.getAppId(), "DATA_CAPTURED", "Evidence Collection Completed");
        };
    }

    @Bean
    public Consumer<EligibilityDeterminedEvent> eligibilityDetermined() {
        return event -> {
            String details = "Eligibility Determination: " + event.getStatus() + " (Plan: " + event.getPlanName() + ")";
            processEvent(event.getAppId(), "ELIGIBILITY_DETERMINED", details);
        };
    }

    private void processEvent(Long appId, String eventType, String details) {
        logger.info("Processing Kafka event {} for AppId: {}", eventType, appId);
        
        // 1. Save to DB for history
        AnalyticsEntity log = AnalyticsEntity.builder()
                .appId(appId)
                .eventType(eventType)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        repository.save(log);

        // 2. Broadcast to WebSocket
        messagingTemplate.convertAndSend("/topic/dashboard", log);
        logger.info("Broadcasted {} to WebSocket topic", eventType);
    }
}
