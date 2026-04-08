package com.his.ed.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "dc-service", url = "${ed.client.dc.url}")
public interface DcClient {
    
    @GetMapping("/api/dc/summary/{appId}")
    DcCaseResponse getCaseSummary(@PathVariable("appId") Long appId);

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
