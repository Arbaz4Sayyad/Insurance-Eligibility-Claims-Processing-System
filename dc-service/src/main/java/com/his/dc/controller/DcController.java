package com.his.dc.controller;

import com.his.dc.client.ArFeignClient;
import com.his.dc.model.*;
import com.his.dc.payload.response.ApiResponse;
import com.his.dc.repository.CaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dc")
public class DcController {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private ArFeignClient arFeignClient;

    @Autowired
    private org.springframework.cloud.stream.function.StreamBridge streamBridge;

    @PostMapping("/case/{appId}")
    public ResponseEntity<ApiResponse<String>> createCase(@PathVariable Long appId) {
        // 1. Validate AppId via Feign
        Boolean isValid = arFeignClient.validateAppId(appId);
        if (Boolean.FALSE.equals(isValid)) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("INVALID_APP_ID", "Application ID is invalid or does not exist.", "Case creation failed")
            );
        }

        // 2. Create or Get Case (Idempotent)
        CaseEntity caseEntity = caseRepository.findByAppId(appId)
                .orElse(CaseEntity.builder().appId(appId).build());

        if (caseEntity.getCaseId() == null) {
            caseRepository.save(caseEntity);
        }

        return ResponseEntity.ok(ApiResponse.success("Case initialized", "Case created/retrieved for AppId: " + appId));
    }

    @PostMapping("/income/{appId}")
    public ResponseEntity<ApiResponse<String>> addIncome(@PathVariable Long appId, @RequestBody IncomeRecord incoming) {
        CaseEntity caseEntity = caseRepository.findByAppId(appId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        incoming.setCaseEntity(caseEntity);
        if (caseEntity.getIncomeRecords() == null) {
            caseEntity.setIncomeRecords(new java.util.ArrayList<>());
        }
        
        // Idempotency: Avoid duplicates by checking existing records (Simplified for demo)
        caseEntity.getIncomeRecords().add(incoming);
        caseRepository.save(caseEntity);

        return ResponseEntity.ok(ApiResponse.success("Income added", "Income added successfully"));
    }

    @PostMapping("/household/{appId}")
    public ResponseEntity<ApiResponse<String>> addHouseholdMember(@PathVariable Long appId, @RequestBody HouseholdMember member) {
        CaseEntity caseEntity = caseRepository.findByAppId(appId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        member.setCaseEntity(caseEntity);
        if (caseEntity.getHouseholdMembers() == null) {
            caseEntity.setHouseholdMembers(new java.util.ArrayList<>());
        }
        caseEntity.getHouseholdMembers().add(member);
        caseRepository.save(caseEntity);

        return ResponseEntity.ok(ApiResponse.success("Household member added", "Household member added successfully"));
    }

    @PostMapping("/expense/{appId}")
    public ResponseEntity<ApiResponse<String>> addExpense(@PathVariable Long appId, @RequestBody ExpenseRecord expense) {
        CaseEntity caseEntity = caseRepository.findByAppId(appId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        expense.setCaseEntity(caseEntity);
        if (caseEntity.getExpenseRecords() == null) {
            caseEntity.setExpenseRecords(new java.util.ArrayList<>());
        }
        caseEntity.getExpenseRecords().add(expense);
        caseRepository.save(caseEntity);

        return ResponseEntity.ok(ApiResponse.success("Expense added", "Expense added successfully"));
    }

    @GetMapping("/summary/{appId}")
    public ResponseEntity<ApiResponse<CaseEntity>> getSummary(@PathVariable Long appId) {
        CaseEntity app = caseRepository.findByAppId(appId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        return ResponseEntity.ok(ApiResponse.success(app, "Case summary retrieved"));
    }

    @PostMapping("/complete/{appId}")
    public ResponseEntity<ApiResponse<String>> completeDataCollection(@PathVariable Long appId) {
        com.his.dc.event.DataCapturedEvent event = com.his.dc.event.DataCapturedEvent.builder()
                .appId(appId)
                .status("COMPLETED")
                .eventType("data.collection.completed")
                .build();
        streamBridge.send("dataCaptured-out-0", event);

        return ResponseEntity.ok(ApiResponse.success("Captured", "Data collection marked as complete for AppId: " + appId));
    }
}
