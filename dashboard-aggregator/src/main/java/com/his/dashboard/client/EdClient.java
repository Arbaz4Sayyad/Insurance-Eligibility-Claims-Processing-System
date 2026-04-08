package com.his.dashboard.client;

import com.his.dashboard.dto.ApiResponse;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "ed-service")
public interface EdClient {

    @GetMapping("/api/ed/stats")
    ApiResponse<EligibilityStatsResponse> getStats();

    @Data
    class EligibilityStatsResponse {
        private long approvedToday;
        private long rejectedToday;
        private double approvalRate;
    }
}
