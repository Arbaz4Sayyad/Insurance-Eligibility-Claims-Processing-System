package com.his.dashboard.controller;

import com.his.dashboard.dto.AdminDashboardResponse;
import com.his.dashboard.dto.ApiResponse;
import com.his.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class AdminDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse data = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(data, "Admin dashboard data retrieved successfully"));
    }
}
