package com.his.dashboard.client;

import com.his.dashboard.dto.ApiResponse;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "bi-service")
public interface BiClient {

    @GetMapping("/api/bi/status/{appId}")
    ApiResponse<BenefitAccount> getStatus(@PathVariable("appId") Long appId);

    @Data
    class BenefitAccount {
        private Long id;
        private Long appId;
        private String planName;
        private Double amount;
        private String status; // e.g., ACTIVE, SUSPENDED
    }
}
