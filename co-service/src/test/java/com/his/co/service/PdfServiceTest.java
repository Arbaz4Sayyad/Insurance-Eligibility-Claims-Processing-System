package com.his.co.service;

import com.his.co.event.EligibilityDeterminedEvent;
import com.his.co.model.CoNoticeEntity;
import com.his.co.repository.CoNoticeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.file.Path;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PdfServiceTest {

    @Mock
    private TemplateEngine templateEngine;

    @Mock
    private CoNoticeRepository noticeRepository;

    @InjectMocks
    private PdfService pdfService;

    private EligibilityDeterminedEvent approvedEvent;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        approvedEvent = new EligibilityDeterminedEvent();
        approvedEvent.setAppId(1L);
        approvedEvent.setCitizenName("John Doe");
        approvedEvent.setPlanName("SNAP");
        approvedEvent.setStatus("APPROVED");
        approvedEvent.setBenefitAmount(350.0);
    }

    @Test
    void testGenerateNotice_Success() throws Exception {
        // Mocking behavior
        when(noticeRepository.findByAppId(1L)).thenReturn(Optional.empty());
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html><body>Mock PDF Content</body></html>");
        
        // Ensure the test uses a safe output directory (we can't easily change private static final OUTPUT_DIR without reflection, but we can verify it doesn't fail)
        // For a true unit test, we might refactor PdfService to inject the output directory.
        // But for now, we'll verify the logical flow.

        pdfService.generateNotice(approvedEvent);

        verify(noticeRepository).save(any(CoNoticeEntity.class));
        verify(templateEngine).process(eq("approval_notice"), any(Context.class));
    }

    @Test
    void testGenerateNotice_Idempotency() throws Exception {
        when(noticeRepository.findByAppId(1L)).thenReturn(Optional.of(new CoNoticeEntity()));

        pdfService.generateNotice(approvedEvent);

        // Should return early and not call template engine or save repository
        verify(templateEngine, never()).process(anyString(), any());
        verify(noticeRepository, never()).save(any());
    }

    @Test
    void testGenerateNotice_DenialTemplate() throws Exception {
        approvedEvent.setStatus("REJECTED");
        approvedEvent.setDenialReason("High Income");

        when(noticeRepository.findByAppId(1L)).thenReturn(Optional.empty());
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html><body>Mock Denial Content</body></html>");

        pdfService.generateNotice(approvedEvent);

        verify(templateEngine).process(eq("denial_notice"), any(Context.class));
        verify(noticeRepository).save(argThat(notice -> 
            notice.getStatus().equals("REJECTED") && notice.getMessage().contains("rejected")
        ));
    }
}
