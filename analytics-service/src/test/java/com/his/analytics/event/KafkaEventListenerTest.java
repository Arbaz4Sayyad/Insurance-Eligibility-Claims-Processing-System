package com.his.analytics.event;

import com.his.analytics.model.AnalyticsEntity;
import com.his.analytics.repository.AnalyticsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.function.Consumer;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class KafkaEventListenerTest {

    @Mock
    private AnalyticsRepository repository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private KafkaEventListener listener;

    @Test
    void testApplicationCreated_LogsAndBroadcasts() {
        ApplicationCreatedEvent event = new ApplicationCreatedEvent();
        event.setAppId(1L);

        Consumer<ApplicationCreatedEvent> consumer = listener.applicationCreated();
        consumer.accept(event);

        verify(repository).save(any(AnalyticsEntity.class));
        verify(messagingTemplate).convertAndSend(eq("/topic/dashboard"), any(AnalyticsEntity.class));
    }

    @Test
    void testEligibilityDetermined_LogsCorrectDetails() {
        EligibilityDeterminedEvent event = new EligibilityDeterminedEvent();
        event.setAppId(1L);
        event.setStatus("APPROVED");
        event.setPlanName("SNAP");

        Consumer<EligibilityDeterminedEvent> consumer = listener.eligibilityDetermined();
        consumer.accept(event);

        verify(repository).save(argThat(log -> 
            log.getDetails().contains("APPROVED") && log.getDetails().contains("SNAP")
        ));
    }
}
