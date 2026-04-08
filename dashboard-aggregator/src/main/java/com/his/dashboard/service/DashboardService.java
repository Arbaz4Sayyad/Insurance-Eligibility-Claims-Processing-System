package com.his.dashboard.service;

import com.his.dashboard.client.AnalyticsClient;
import com.his.dashboard.client.ArClient;
import com.his.dashboard.client.EdClient;
import com.his.dashboard.client.BiClient;
import com.his.dashboard.client.UserClient;
import com.his.dashboard.dto.AdminDashboardResponse;
import com.his.dashboard.dto.ApiResponse;
import com.his.dashboard.dto.CaseworkerDashboardResponse;
import com.his.dashboard.dto.CitizenDashboardResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserClient userClient;

    @Autowired
    private ArClient arClient;

    @Autowired
    private AnalyticsClient analyticsClient;

    @Autowired
    private EdClient edClient;

    @Autowired
    private BiClient biClient;

    public AdminDashboardResponse getAdminDashboard() {
        
        // 1. Parallelize calls to User, AR, and Analytics services
        CompletableFuture<ApiResponse<UserClient.UserStatsResponse>> userStatsFuture = 
            CompletableFuture.supplyAsync(() -> userClient.getUserStats());

        CompletableFuture<ApiResponse<ArClient.ApplicationPageResponse>> arStatsFuture = 
            CompletableFuture.supplyAsync(() -> arClient.getAllApplications(null, 0, 1));

        CompletableFuture<List<AnalyticsClient.SystemLog>> logsFuture = 
            CompletableFuture.supplyAsync(() -> {
                try {
                    return analyticsClient.getLogs();
                } catch (Exception e) {
                    return Collections.emptyList();
                }
            });

        // 2. Wait for all to complete (Joint performance)
        CompletableFuture.allOf(userStatsFuture, arStatsFuture, logsFuture).join();

        try {
            UserClient.UserStatsResponse userStats = userStatsFuture.get().getData();
            ArClient.ApplicationPageResponse arStats = arStatsFuture.get().getData();
            List<AnalyticsClient.SystemLog> logs = logsFuture.get();

            // 3. Map to UI-friendly DTO
            return AdminDashboardResponse.builder()
                .totalUsers(userStats != null ? userStats.getTotalUsers() : 0)
                .activeCaseworkers(userStats != null ? userStats.getActiveCaseworkers() : 0)
                .applicationsThisMonth(arStats != null ? arStats.getTotalElements() : 0)
                .systemHealth(AdminDashboardResponse.SystemHealth.builder()
                    .status(logs.isEmpty() ? "DEGRADED" : "UP")
                    .services(List.of("AR:80%", "USER:100%", "ANALYTICS:100%"))
                    .build())
                .recentActivities(logs.stream().limit(5).map(log -> 
                    AdminDashboardResponse.RecentActivity.builder()
                        .id(log.getId())
                        .type("SYSTEM_ALERT")
                        .user("SYSTEM")
                        .time(log.getTimestamp().toString())
                        .build()
                ).collect(Collectors.toList()))
                .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to aggregate Admin Dashboard: " + e.getMessage());
        }
    }

    @CircuitBreaker(name = "downstreamService", fallbackMethod = "caseworkerFallback")
    public CaseworkerDashboardResponse getCaseworkerDashboard() {
        // 1. Parallelize calls to AR and ED services
        CompletableFuture<ApiResponse<Map<String, Long>>> arStatsFuture =
                CompletableFuture.supplyAsync(() -> arClient.getStatusCounts());

        CompletableFuture<ApiResponse<ArClient.ApplicationPageResponse>> pendingQueueFuture =
                CompletableFuture.supplyAsync(() -> arClient.getAllApplications("PENDING", 0, 10));

        CompletableFuture<ApiResponse<EdClient.EligibilityStatsResponse>> edStatsFuture =
                CompletableFuture.supplyAsync(() -> edClient.getStats());

        // 2. Wait for all to complete
        CompletableFuture.allOf(arStatsFuture, pendingQueueFuture, edStatsFuture).join();

        try {
            Map<String, Long> arStats = arStatsFuture.get().getData();
            ArClient.ApplicationPageResponse pendingQueue = pendingQueueFuture.get().getData();
            EdClient.EligibilityStatsResponse edStats = edStatsFuture.get().getData();

            long pendingCount = arStats != null ? arStats.getOrDefault("PENDING", 0L) : 0L;
            long approvedToday = edStats != null ? edStats.getApprovedToday() : 0L;
            long rejectedToday = edStats != null ? edStats.getRejectedToday() : 0L;
            double approvalRate = edStats != null ? edStats.getApprovalRate() : 0.0;

            List<CaseworkerDashboardResponse.ApplicationQueueItem> priorityQueue = pendingQueue != null && pendingQueue.getContent() != null
                ? pendingQueue.getContent().stream().map(app -> {
                    // SLA breach logic: older than 48 hours
                    LocalDateTime createdAt;
                    try {
                        createdAt = LocalDateTime.parse(app.getCreatedAt());
                    } catch (Exception e) {
                        createdAt = LocalDateTime.now(); // fallback
                    }
                    boolean breach = ChronoUnit.HOURS.between(createdAt, LocalDateTime.now()) > 48;

                    return CaseworkerDashboardResponse.ApplicationQueueItem.builder()
                            .appId(app.getId())
                            .applicantName(app.getCitizen() != null ? app.getCitizen().getFirstName() + " " + app.getCitizen().getLastName() : "Unknown")
                            .plan("STANDARD") // Would normally come from requested plan
                            .submittedAt(app.getCreatedAt())
                            .slaBreach(breach)
                            .build();
                }).collect(Collectors.toList())
                : Collections.emptyList();

            return CaseworkerDashboardResponse.builder()
                    .pendingApplications(pendingCount)
                    .approvedToday(approvedToday)
                    .rejectedToday(rejectedToday)
                    .approvalRate(approvalRate)
                    .priorityQueue(priorityQueue)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to aggregate Caseworker Dashboard: " + e.getMessage());
        }
    }

    // 🛡️ Fallback for Caseworker Operations
    public CaseworkerDashboardResponse caseworkerFallback(Exception e) {
        return CaseworkerDashboardResponse.builder()
                .pendingApplications(0L)
                .approvedToday(0L)
                .rejectedToday(0L)
                .approvalRate(0.0)
                .priorityQueue(Collections.emptyList())
                // In a real scenario, you might append a system error message to the DTO
                .build();
    }

    @CircuitBreaker(name = "downstreamService", fallbackMethod = "citizenFallback")
    public CitizenDashboardResponse getCitizenDashboard(Long citizenId) {
        // 1. Fetch All Applications for Citizen
        CompletableFuture<ApiResponse<List<ArClient.Application>>> appsFuture =
                CompletableFuture.supplyAsync(() -> arClient.getApplicationsByCitizen(citizenId));

        // Wait to determine the most recent Application ID to fetch Benefit info
        appsFuture.join();

        try {
            List<ArClient.Application> applications = appsFuture.get().getData();

            if (applications == null || applications.isEmpty()) {
                return CitizenDashboardResponse.builder()
                        .activeApplications(Collections.emptyList())
                        .nextSteps(List.of("Start a new Application"))
                        .build();
            }

            // Find most recent application
            ArClient.Application latestApp = applications.stream()
                    .max((a1, a2) -> {
                        try {
                            return LocalDateTime.parse(a1.getCreatedAt()).compareTo(LocalDateTime.parse(a2.getCreatedAt()));
                        } catch (Exception e) {
                            return 0;
                        }
                    }).orElse(applications.get(0));

            // 2. Fetch BI data for the latest app if needed
            CompletableFuture<ApiResponse<BiClient.BenefitAccount>> biFuture = null;
            if ("BENEFIT_ISSUED".equals(latestApp.getWorkflowStatus())) {
                biFuture = CompletableFuture.supplyAsync(() -> biClient.getStatus(latestApp.getId()));
            }

            // Map Applications
            List<CitizenDashboardResponse.ApplicationSummary> activeApps = applications.stream()
                    .map(app -> CitizenDashboardResponse.ApplicationSummary.builder()
                            .id(app.getId())
                            .status(app.getCaseStatus())
                            .stage(app.getWorkflowStatus() != null ? app.getWorkflowStatus() : "UNKNOWN")
                            .lastUpdated(app.getCreatedAt())
                            .build())
                    .collect(Collectors.toList());

            // Build Details
            var responseBuilder = CitizenDashboardResponse.builder()
                    .activeApplications(activeApps);

            List<String> nextSteps = new java.util.ArrayList<>();

            if (biFuture != null) {
                biFuture.join();
                BiClient.BenefitAccount account = biFuture.get().getData();
                if (account != null) {
                    responseBuilder.benefitStatus(CitizenDashboardResponse.BenefitStatus.builder()
                            .planName(account.getPlanName())
                            .amount(account.getAmount())
                            .status(account.getStatus())
                            .build());
                    nextSteps.add("Manage your benefits account");
                }
            } else {
                // Dynamic Next Steps based on workflow status
                if ("REGISTRATION_COMPLETE".equals(latestApp.getWorkflowStatus())) {
                    nextSteps.add("Complete Household & Income Data Collection");
                } else if ("DATA_COLLECTION_COMPLETED".equals(latestApp.getWorkflowStatus())) {
                    nextSteps.add("Await Eligibility Determination");
                } else {
                    nextSteps.add("Review Application Status");
                }
            }

            responseBuilder.nextSteps(nextSteps);
            return responseBuilder.build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to aggregate Citizen Dashboard: " + e.getMessage());
        }
    }

    // 🛡️ Fallback for Citizen Portal
    public CitizenDashboardResponse citizenFallback(Long citizenId, Exception e) {
        return CitizenDashboardResponse.builder()
                .activeApplications(Collections.emptyList())
                .nextSteps(List.of("System is temporarily degraded. Please check back later."))
                .build();
    }
}
