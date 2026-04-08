package com.his.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long activeCaseworkers;
    private long applicationsThisMonth;
    private SystemHealth systemHealth;
    private List<RecentActivity> recentActivities;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SystemHealth {
        private String status; // UP | DEGRADED | DOWN
        private List<String> services;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentActivity {
        private String id;
        private String type; // NEW_PLAN, USER_REG, SYSTEM_ALERT
        private String user;
        private String time; // Human-readable (e.g., "2h ago")
    }
}
