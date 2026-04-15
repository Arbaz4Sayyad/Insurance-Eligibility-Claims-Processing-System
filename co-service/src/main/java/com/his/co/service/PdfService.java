package com.his.co.service;

import com.his.co.event.EligibilityDeterminedEvent;
import com.his.co.model.CoNoticeEntity;
import com.his.co.repository.CoNoticeRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
public class PdfService {

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private CoNoticeRepository noticeRepository;

    private static final String OUTPUT_DIR = "notices/";

    public void generateNotice(EligibilityDeterminedEvent event) throws Exception {
        // 0. Idempotency Check
        if (noticeRepository.findByAppId(event.getAppId()).isPresent()) {
            return; // Already generated
        }
        
        // 1. Prepare Thymeleaf Context
        Context context = new Context();
        context.setVariable("appId", event.getAppId());
        context.setVariable("planName", event.getPlanName());
        context.setVariable("status", event.getStatus());
        context.setVariable("amount", event.getBenefitAmount());
        context.setVariable("reason", event.getDenialReason());
        context.setVariable("date", LocalDateTime.now());

        String template = event.getStatus().equalsIgnoreCase("APPROVED") ? "approval_notice" : "denial_notice";
        String htmlContent = templateEngine.process(template, context);

        // 2. Ensure Output Directory Exists
        Path path = Paths.get(OUTPUT_DIR);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String fileName = "Notice_" + event.getAppId() + "_" + System.currentTimeMillis() + ".pdf";
        String filePath = OUTPUT_DIR + fileName;

        // 3. Render HTML to PDF
        try (OutputStream os = new FileOutputStream(filePath)) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(os);
            builder.run();
        }

        // 4. Save to Database
        String message = event.getStatus().equalsIgnoreCase("APPROVED") 
            ? "Congratulations " + event.getCitizenName() + "! Your application for " + event.getPlanName() + " has been approved for a monthly benefit of $" + event.getBenefitAmount() + "."
            : "Dear " + event.getCitizenName() + ", unfortunately your application for " + event.getPlanName() + " was rejected due to: " + event.getDenialReason() + ".";

        CoNoticeEntity notice = CoNoticeEntity.builder()
                .appId(event.getAppId())
                .citizenName(event.getCitizenName())
                .status(event.getStatus())
                .message(message)
                .filePath(filePath)
                .sentAt(LocalDateTime.now())
                .build();
        
        noticeRepository.save(notice);
    }
}
