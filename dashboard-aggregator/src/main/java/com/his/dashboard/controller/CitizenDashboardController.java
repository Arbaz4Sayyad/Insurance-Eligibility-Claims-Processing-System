package com.his.dashboard.controller;

import com.his.dashboard.dto.ApiResponse;
import com.his.dashboard.dto.CitizenDashboardResponse;
import com.his.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard/citizen")
public class CitizenDashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<CitizenDashboardResponse>> getCitizenDashboard(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long citizenId) {
        
        // In a real application, the citizenId would be extracted from the JWT SecurityContext.
        // We use X-User-Id as a fallback/mock for now.
        CitizenDashboardResponse data = dashboardService.getCitizenDashboard(citizenId);
        
        return ResponseEntity.ok(ApiResponse.success(data, "Citizen Dashboard Data fetched successfully"));
    }
}
