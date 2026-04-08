package com.his.dc.event;

import com.his.dc.model.CaseEntity;
import com.his.dc.repository.CaseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
public class ApplicationEventListener {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationEventListener.class);

    @Autowired
    private CaseRepository caseRepository;

    @Bean
    public Consumer<ApplicationCreatedEvent> applicationCreated() {
        return event -> {
            logger.info("Received ApplicationCreatedEvent for AppId: {}", event.getAppId());
            
            // Check for idempotency
            caseRepository.findByAppId(event.getAppId())
                    .ifPresentOrElse(
                        c -> logger.info("Case already exists for AppId: {}", event.getAppId()),
                        () -> {
                            CaseEntity newCase = CaseEntity.builder()
                                    .appId(event.getAppId())
                                    .build();
                            caseRepository.save(newCase);
                            logger.info("New Case created for AppId: {}", event.getAppId());
                        }
                    );
        };
    }
}
