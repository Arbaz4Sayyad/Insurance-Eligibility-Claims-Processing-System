package com.his.dashboard.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CitizenDashboardResponse {

    private List<ApplicationSummary> activeApplications;
    private BenefitStatus benefitStatus;
    private List<String> nextSteps;

    @Data
    @Builder
    public static class ApplicationSummary {
        private Long id;
        private String status;        // e.g. PENDING, APPROVED
        private String stage;        // e.g. DATA_COLLECTION_PENDING
        private String lastUpdated;
    }

    @Data
    @Builder
    public static class BenefitStatus {
        private String planName;
        private Double amount;
        private String status;
    }
}
