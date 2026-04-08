package com.his.ar.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.his.ar.model.OutboxEvent;
import com.his.ar.repository.OutboxEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OutboxRelayScheduler {

    private static final Logger log = LoggerFactory.getLogger(OutboxRelayScheduler.class);

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Autowired
    private StreamBridge streamBridge;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Polls the outbox table every 5 seconds for PENDING events.
     * Uses strict transactional boundaries to ensure events are marked SENT.
     */
    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void relayOutboxEvents() {
        LocalDateTime now = LocalDateTime.now();
        List<OutboxEvent> pendingEvents = outboxEventRepository.findByStatus("PENDING").stream()
                .filter(e -> e.getNextRetryAt() == null || !e.getNextRetryAt().isAfter(now))
                .collect(Collectors.toList());

        if (!pendingEvents.isEmpty()) {
            log.info("[OBSERVABILITY] Found {} pending outbox events ready for relay.", pendingEvents.size());
        }

        for (OutboxEvent event : pendingEvents) {
            try {
                Map<String, Object> payload = objectMapper.readValue(event.getPayload(), new TypeReference<Map<String, Object>>() {});
                
                boolean sent = streamBridge.send(event.getTopic(), payload);
                if (sent) {
                    event.setStatus("SENT");
                    outboxEventRepository.save(event);
                    log.info("[OBSERVABILITY] Successfully published event [{}] to topic [{}]", event.getEventId(), event.getTopic());
                } else {
                    handleFailure(event, "StreamBridge rejected payload");
                }
            } catch (Exception e) {
                handleFailure(event, e.getMessage());
            }
        }
    }

    private void handleFailure(OutboxEvent event, String reason) {
        int maxRetries = 5;
        event.setRetryCount(event.getRetryCount() + 1);

        if (event.getRetryCount() >= maxRetries) {
            event.setStatus("FAILED"); // Permanent Dead Letter status
            log.error("[OBSERVABILITY - ALERT] Event [{}] permanently failed after {} retries. Reason: {}", 
                    event.getEventId(), maxRetries, reason);
        } else {
            // Exponential Backoff: 2^retryCount * 5 seconds
            long delaySeconds = (long) Math.pow(2, event.getRetryCount()) * 5;
            event.setNextRetryAt(LocalDateTime.now().plusSeconds(delaySeconds));
            log.warn("[OBSERVABILITY] Event [{}] failed to publish. Retry {}/{}. Backoff {}s. Error: {}", 
                    event.getEventId(), event.getRetryCount(), maxRetries, delaySeconds, reason);
        }
        
        outboxEventRepository.save(event);
    }
}
