package com.his.ar.event;

import com.his.ar.model.ApplicationEntity;
import com.his.ar.model.WorkflowStatus;
import com.his.ar.repository.ApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationEventListenerTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationEventListener eventListener;

    private ApplicationEntity application;

    @BeforeEach
    void setUp() {
        application = ApplicationEntity.builder()
                .id(1L)
                .workflowStatus(WorkflowStatus.REGISTRATION_COMPLETE)
                .caseStatus("PENDING")
                .build();
    }

    @Test
    void testDataCapturedConsumer_Success() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        
        Map<String, Object> event = new HashMap<>();
        event.put("appId", 1L);
        event.put("status", "COMPLETED");

        Consumer<Map<String, Object>> consumer = eventListener.dataCapturedConsumer();
        consumer.accept(event);

        assertEquals(WorkflowStatus.DATA_COLLECTION_COMPLETED, application.getWorkflowStatus());
        verify(applicationRepository).save(application);
    }

    @Test
    void testEligibilityDeterminedConsumer_Approved() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        
        Map<String, Object> event = new HashMap<>();
        event.put("appId", 1L);
        event.put("status", "APPROVED");

        Consumer<Map<String, Object>> consumer = eventListener.eligibilityDeterminedConsumer();
        consumer.accept(event);

        assertEquals(WorkflowStatus.ELIGIBILITY_APPROVED, application.getWorkflowStatus());
        assertEquals("APPROVED", application.getCaseStatus());
        verify(applicationRepository).save(application);
    }

    @Test
    void testEligibilityDeterminedConsumer_Rejected() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        
        Map<String, Object> event = new HashMap<>();
        event.put("appId", 1L);
        event.put("status", "REJECTED");

        Consumer<Map<String, Object>> consumer = eventListener.eligibilityDeterminedConsumer();
        consumer.accept(event);

        assertEquals(WorkflowStatus.ELIGIBILITY_REJECTED, application.getWorkflowStatus());
        assertEquals("REJECTED", application.getCaseStatus());
        verify(applicationRepository).save(application);
    }

    @Test
    void testIdempotency_AlreadyProcessed() {
        application.setWorkflowStatus(WorkflowStatus.DATA_COLLECTION_COMPLETED);
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));

        Map<String, Object> event = new HashMap<>();
        event.put("appId", 1L);
        
        eventListener.dataCapturedConsumer().accept(event);

        // Should not save again if status is already correct
        verify(applicationRepository, never()).save(any());
    }
}
