package com.his.dashboard.client;

import com.his.dashboard.dto.ApiResponse;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(name = "ar-service")
public interface ArClient {

    @GetMapping("/api/ar/all")
    ApiResponse<ApplicationPageResponse> getAllApplications(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    );

    @GetMapping("/api/ar/stats")
    ApiResponse<java.util.Map<String, Long>> getStatusCounts();

    @GetMapping("/api/ar/citizen/{citizenId}")
    ApiResponse<List<Application>> getApplicationsByCitizen(@PathVariable("citizenId") Long citizenId);

    @Data
    class ApplicationPageResponse {
        private long totalElements;
        private int totalPages;
        private List<Application> content;
    }

    @Data
    class Application {
        private Long id;
        private Citizen citizen;
        private String caseStatus;
        private String workflowStatus;
        private String createdAt;
        private String createdBy;
    }

    @Data
    class Citizen {
        private Long id;
        private String firstName;
        private String lastName;
    }
}
