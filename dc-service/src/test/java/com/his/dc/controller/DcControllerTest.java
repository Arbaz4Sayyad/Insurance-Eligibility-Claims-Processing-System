package com.his.dc.controller;

import com.his.dc.client.ArFeignClient;
import com.his.dc.model.CaseEntity;
import com.his.dc.repository.CaseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DcControllerTest {

    @Mock
    private CaseRepository caseRepository;

    @Mock
    private ArFeignClient arFeignClient;

    @Mock
    private StreamBridge streamBridge;

    @InjectMocks
    private DcController dcController;

    private Long appId = 101L;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testCreateCase_Success() {
        when(arFeignClient.validateAppId(appId)).thenReturn(true);
        when(caseRepository.findByAppId(appId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = dcController.createCase(appId);

        assertEquals(200, response.getStatusCode().value());
        verify(caseRepository).save(any(CaseEntity.class));
    }

    @Test
    void testCreateCase_InvalidAppId() {
        when(arFeignClient.validateAppId(appId)).thenReturn(false);

        ResponseEntity<?> response = dcController.createCase(appId);

        assertEquals(400, response.getStatusCode().value());
        verify(caseRepository, never()).save(any());
    }

    @Test
    void testCompleteDataCollection() {
        ResponseEntity<?> response = dcController.completeDataCollection(appId);

        assertEquals(200, response.getStatusCode().value());
        verify(streamBridge).send(eq("dataCaptured-out-0"), any());
    }

    @Test
    void testGetSummary() {
        CaseEntity caseEntity = CaseEntity.builder().appId(appId).build();
        when(caseRepository.findByAppId(appId)).thenReturn(Optional.of(caseEntity));

        ResponseEntity<?> response = dcController.getSummary(appId);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }
}
