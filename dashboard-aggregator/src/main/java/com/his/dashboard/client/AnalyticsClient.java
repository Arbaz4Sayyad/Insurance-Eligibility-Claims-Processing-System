package com.his.dashboard.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.time.LocalDateTime;
import java.util.List;

@FeignClient(name = "analytics-service")
public interface AnalyticsClient {

    @GetMapping("/api/analytics/history")
    List<AnalyticsRecord> getHistory();

    @GetMapping("/api/analytics/logs")
    List<SystemLog> getLogs();

    @Data
    class AnalyticsRecord {
        private String eventType;
        private LocalDateTime timestamp;
        private String details;
    }

    @Data
    class SystemLog {
        private String id;
        private String message;
        private String level;
        private LocalDateTime timestamp;
    }
}
