package com.his.dashboard.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class CaseworkerDashboardResponse {
    private long pendingApplications;
    private long approvedToday;
    private long rejectedToday;
    private double approvalRate;
    private List<ApplicationQueueItem> priorityQueue;

    @Data
    @Builder
    public static class ApplicationQueueItem {
        private Long appId;
        private String applicantName;
        private String plan;
        private String submittedAt;
        private boolean slaBreach;
    }
}
