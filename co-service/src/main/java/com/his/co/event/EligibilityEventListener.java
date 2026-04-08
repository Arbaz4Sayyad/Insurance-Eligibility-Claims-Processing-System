package com.his.co.event;

import com.his.co.service.PdfService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
public class EligibilityEventListener {

    private static final Logger logger = LoggerFactory.getLogger(EligibilityEventListener.class);

    @Autowired
    private PdfService pdfService;

    @Bean
    public Consumer<EligibilityDeterminedEvent> eligibilityDetermined() {
        return event -> {
            logger.info("Received EligibilityDeterminedEvent for AppId: {}", event.getAppId());
            try {
                pdfService.generateNotice(event);
                logger.info("Notice generated successfully for AppId: {}", event.getAppId());
            } catch (Exception e) {
                logger.error("Error generating notice for AppId: {}: {}", event.getAppId(), e.getMessage());
            }
        };
    }
}
