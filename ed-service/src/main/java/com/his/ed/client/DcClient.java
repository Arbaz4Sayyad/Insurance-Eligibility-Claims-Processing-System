package com.his.ed.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "dc-service")
public interface DcClient {
    
    @GetMapping("/api/dc/summary/{appId}")
    com.his.ed.payload.response.ApiResponse<java.util.Map<String, Object>> getCaseSummary(@PathVariable("appId") Long appId);

    @Data
    class DcCaseResponse {
        private Long caseId;
        private Long appId;
        private List<HouseholdMember> householdMembers;
        private List<IncomeRecord> incomeRecords;
    }

    @Data
    class HouseholdMember {
        private String relationship;
    }

    @Data
    class IncomeRecord {
        private Double amount;
        private String type;
    }
}
