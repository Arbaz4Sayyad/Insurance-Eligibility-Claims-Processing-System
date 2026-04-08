package com.his.dashboard.controller;

import com.his.dashboard.dto.ApiResponse;
import com.his.dashboard.dto.CaseworkerDashboardResponse;
import com.his.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard/caseworker")
public class CaseworkerDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<CaseworkerDashboardResponse>> getCaseworkerDashboard() {
        CaseworkerDashboardResponse data = dashboardService.getCaseworkerDashboard();
        return ResponseEntity.ok(ApiResponse.success(data, "Caseworker Dashboard Data fetched successfully"));
    }
}
