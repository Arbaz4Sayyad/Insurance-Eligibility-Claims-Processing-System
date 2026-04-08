package com.his.ed.controller;

import com.his.ed.model.EligibilityResult;
import com.his.ed.payload.response.ApiResponse;
import com.his.ed.repository.EligibilityResultRepository;
import com.his.ed.service.EligibilityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/ed")
public class EdController {

    @Autowired
    private EligibilityEngine engine;

    @Autowired
    private EligibilityResultRepository resultRepository;

    @PostMapping("/determine/{appId}")
    public ResponseEntity<ApiResponse<List<EligibilityResult>>> determine(@PathVariable Long appId) {
        List<EligibilityResult> results = engine.determineEligibility(appId);
        return ResponseEntity.ok(ApiResponse.success(results, "Eligibility determined successfully"));
    }

    @GetMapping("/history/{appId}")
    public ResponseEntity<ApiResponse<List<EligibilityResult>>> getHistory(@PathVariable Long appId) {
        List<EligibilityResult> history = resultRepository.findByAppId(appId);
        return ResponseEntity.ok(ApiResponse.success(history, "History retrieved"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        long approvedToday = resultRepository.countByStatusAndDeterminedAtBetween("APPROVED", startOfDay, endOfDay);
        long rejectedToday = resultRepository.countByStatusAndDeterminedAtBetween("REJECTED", startOfDay, endOfDay);
        
        long totalToday = approvedToday + rejectedToday;
        double approvalRate = totalToday == 0 ? 0.0 : ((double) approvedToday / totalToday) * 100.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("approvedToday", approvedToday);
        stats.put("rejectedToday", rejectedToday);
        stats.put("approvalRate", approvalRate);

        return ResponseEntity.ok(ApiResponse.success(stats, "Stats retrieved"));
    }
}
