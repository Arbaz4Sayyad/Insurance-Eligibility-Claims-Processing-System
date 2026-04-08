package com.his.ar.event;

import com.his.ar.model.ApplicationEntity;
import com.his.ar.model.WorkflowStatus;
import com.his.ar.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.function.Consumer;

@Configuration
public class ApplicationEventListener {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Bean
    public Consumer<Map<String, Object>> dataCapturedConsumer() {
        return event -> {
            try {
                Long appId = Long.valueOf(event.get("appId").toString());
                applicationRepository.findById(appId).ifPresent(app -> {
                    app.setWorkflowStatus(WorkflowStatus.DATA_COLLECTION_COMPLETED);
                    applicationRepository.save(app);
                });
            } catch (Exception e) {
                // Log and push to DLQ in a real scenario
                e.printStackTrace();
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
                    if ("APPROVED".equals(status)) {
                        app.setWorkflowStatus(WorkflowStatus.ELIGIBILITY_APPROVED);
                        app.setCaseStatus("APPROVED");
                    } else {
                        app.setWorkflowStatus(WorkflowStatus.ELIGIBILITY_REJECTED);
                        app.setCaseStatus("REJECTED");
                    }
                    applicationRepository.save(app);
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
    }

    // BI event consumer would go here
}
