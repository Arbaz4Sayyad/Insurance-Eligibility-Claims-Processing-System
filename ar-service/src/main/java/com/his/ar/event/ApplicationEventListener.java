package com.his.ar.event;

import com.his.ar.model.ApplicationEntity;
import com.his.ar.model.WorkflowStatus;
import com.his.ar.repository.ApplicationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.function.Consumer;

@Configuration
@Slf4j
public class ApplicationEventListener {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Bean
    public Consumer<Map<String, Object>> dataCapturedConsumer() {
        return event -> {
            try {
                Long appId = Long.valueOf(event.get("appId").toString());
                applicationRepository.findById(appId).ifPresent(app -> {
                    if (app.getWorkflowStatus() != WorkflowStatus.DATA_COLLECTION_COMPLETED) {
                        app.setWorkflowStatus(WorkflowStatus.DATA_COLLECTION_COMPLETED);
                        applicationRepository.save(app);
                        log.info("Saga ID {}: Data collection completed.", appId);
                    } else {
                        log.debug("Saga ID {}: Data collection already processed. Marking as idempotent.", appId);
                    }
                });
            } catch (Exception e) {
                log.error("Error in dataCapturedConsumer: ", e);
            }
        };
    }

    @Bean
    public Consumer<Map<String, Object>> eligibilityDeterminedConsumer() {
        return event -> {
            try {
                Long appId = Long.valueOf(event.get("appId").toString());
                String status = event.getOrDefault("status", "UNKNOWN").toString();
                
                applicationRepository.findById(appId).ifPresent(app -> {
                    WorkflowStatus targetStatus = "APPROVED".equals(status) ? 
                        WorkflowStatus.ELIGIBILITY_APPROVED : WorkflowStatus.ELIGIBILITY_REJECTED;
                    
                    if (app.getWorkflowStatus() != targetStatus) {
                        app.setWorkflowStatus(targetStatus);
                        app.setCaseStatus(status);
                        applicationRepository.save(app);
                        log.info("Saga ID {}: Eligibility outcome updated to {}.", appId, status);
                    } else {
                        log.debug("Saga ID {}: Eligibility outcome already processed. Marking as idempotent.", appId);
                    }
                });
            } catch (Exception e) {
                log.error("Error in eligibilityDeterminedConsumer: ", e);
            }
        };
    }

    // BI event consumer would go here
}
