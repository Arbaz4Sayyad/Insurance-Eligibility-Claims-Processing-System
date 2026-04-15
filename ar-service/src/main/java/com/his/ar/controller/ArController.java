package com.his.ar.controller;

import com.his.ar.model.ApplicationEntity;
import com.his.ar.model.CitizenEntity;
import com.his.ar.model.WorkflowStatus;
import com.his.ar.payload.request.ArRequest;
import com.his.ar.payload.response.ApiResponse;
import com.his.ar.payload.response.ArResponse;
import com.his.ar.repository.ApplicationRepository;
import com.his.ar.repository.CitizenRepository;
import com.his.ar.repository.OutboxEventRepository;
import com.his.ar.model.PlanEntity;
import com.his.ar.repository.PlanRepository;
import com.his.ar.model.OutboxEvent;
import com.his.ar.util.EncryptionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.his.ar.util.SsnValidatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/ar")
@Slf4j
public class ArController {

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SsnValidatorService ssnValidator;

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private OutboxEventRepository outboxEventRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<ApiResponse<ArResponse>> registerApplication(@RequestBody ArRequest request) {
        
        // 1. Mock SSN Validation
        if (!ssnValidator.isValid(request.getSsn())) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("VALIDATION_FAILED", "Invalid SSN. Validation failed.", "Registration failed")
            );
        }

        try {
            // 2. Encrypt SSN
            String encryptedSsn = encryptionService.encrypt(request.getSsn());

            // 3. Check for existing citizen
            CitizenEntity citizen = citizenRepository.findBySsn(encryptedSsn)
                    .orElse(CitizenEntity.builder()
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .dob(request.getDob())
                            .gender(request.getGender())
                            .ssn(encryptedSsn)
                            .userId(request.getUserId())
                            .build());

            if (citizen.getId() == null) {
                citizen = citizenRepository.save(citizen);
            } else if (citizen.getUserId() == null) {
                // Retroactively link userId if first time submitting with identity
                citizen.setUserId(request.getUserId());
                citizen = citizenRepository.save(citizen);
            }

            // 4. Create Application
            ApplicationEntity application = ApplicationEntity.builder()
                    .citizen(citizen)
                    .caseStatus("PENDING")
                    .workflowStatus(WorkflowStatus.REGISTRATION_COMPLETE)
                    .createdAt(LocalDateTime.now())
                    .createdBy("SYSTEM") // Should come from SecurityContext
                    .build();

            application = applicationRepository.save(application);

            // 5. Store Event in Transactional Outbox
            com.his.ar.event.ApplicationCreatedEvent event = com.his.ar.event.ApplicationCreatedEvent.builder()
                    .appId(application.getId())
                    .citizenId(citizen.getId())
                    .status("CREATED")
                    .eventType("application.created")
                    .build();
            
            OutboxEvent outboxEvent = OutboxEvent.builder()
                    .eventId(java.util.UUID.randomUUID())
                    .eventType("application.created")
                    .topic("applicationCreated-out-0")
                    .aggregateId(application.getId())
                    .payload(objectMapper.writeValueAsString(event))
                    .status("PENDING")
                    .createdAt(LocalDateTime.now())
                    .build();
            
            outboxEventRepository.save(outboxEvent);

            ArResponse data = ArResponse.builder()
                    .appId(application.getId())
                    .status("SUCCESS")
                    .message("Application registered successfully.")
                    .build();

            return ResponseEntity.ok(ApiResponse.success(data, "Application registered successfully."));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                ApiResponse.error("INTERNAL_ERROR", e.getMessage(), "Registration failed due to server error")
            );
        }
    }

    @GetMapping("/validate/{appId}")
    public ResponseEntity<ApiResponse<Boolean>> validateAppId(@PathVariable Long appId) {
        boolean exists = applicationRepository.existsById(appId);
        return ResponseEntity.ok(ApiResponse.success(exists, "Validation check complete"));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Page<ApplicationEntity>>> getAllApplications(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        
        Page<ApplicationEntity> page;
        if (status != null && !status.isEmpty()) {
            page = applicationRepository.findByCaseStatus(status, pageable);
        } else {
            page = applicationRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success(page, "Applications retrieved successfully"));
    }

    @GetMapping("/{appId}")
    public ResponseEntity<ApiResponse<ApplicationEntity>> getApplication(@PathVariable Long appId) {
        ApplicationEntity app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return ResponseEntity.ok(ApiResponse.success(app, "Application found"));
    }

    @PutMapping("/{appId}/status")
    public ResponseEntity<ApiResponse<Void>> updateWorkflowStatus(
            @PathVariable Long appId,
            @RequestParam WorkflowStatus status) {
        ApplicationEntity app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setWorkflowStatus(status);
        applicationRepository.save(app);
        return ResponseEntity.ok(ApiResponse.success(null, "Workflow status updated to " + status));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<java.util.Map<String, Long>>> getStatusCounts() {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("PENDING", applicationRepository.countByCaseStatus("PENDING"));
        stats.put("APPROVED", applicationRepository.countByCaseStatus("APPROVED"));
        stats.put("REJECTED", applicationRepository.countByCaseStatus("REJECTED"));
        return ResponseEntity.ok(ApiResponse.success(stats, "Application statistics retrieved"));
    }

    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<ApiResponse<java.util.List<ApplicationEntity>>> getApplicationsByCitizen(@PathVariable Long citizenId) {
        // First try to find by User ID (preferred for cross-service sync)
        java.util.List<ApplicationEntity> apps = applicationRepository.findByCitizen_UserId(citizenId);
        
        // Fallback to local citizen ID for backward compatibility
        if (apps.isEmpty()) {
            apps = applicationRepository.findByCitizen_Id(citizenId);
        }
        
        return ResponseEntity.ok(ApiResponse.success(apps, "Citizen applications retrieved"));
    }

    // --- Plan Management Endpoints ---

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<java.util.List<PlanEntity>>> getAllPlans() {
        try {
            log.info("Fetching all plans...");
            java.util.List<PlanEntity> plans = planRepository.findAll();
            log.info("Found {} plans. Attempting manual serialization to test Jackson...", plans.size());
            
            // Manual serialization test
            String jsonTest = objectMapper.writeValueAsString(plans);
            log.info("Manual serialization successful: {}", jsonTest);
            
            return ResponseEntity.ok(ApiResponse.success(plans, "Plans retrieved successfully"));
        } catch (Exception e) {
            log.error("Error in getAllPlans: ", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("INTERNAL_ERROR", e.getMessage(), "Failed to retrieve plans"));
        }
    }

    @PostMapping("/plans")
    public ResponseEntity<ApiResponse<PlanEntity>> createPlan(@RequestBody PlanEntity plan) {
        try {
            log.info("Creating new plan: {}", plan.getName());
            if (plan.getMembers() == null) plan.setMembers(0L);
            PlanEntity savedPlan = planRepository.save(plan);
            return ResponseEntity.ok(ApiResponse.success(savedPlan, "Plan created successfully"));
        } catch (Exception e) {
            log.error("Error creating plan: ", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("INTERNAL_ERROR", e.getMessage(), "Failed to save plan"));
        }
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<ApiResponse<PlanEntity>> updatePlan(@PathVariable Long id, @RequestBody PlanEntity plan) {
        PlanEntity existing = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        existing.setName(plan.getName());
        existing.setCategory(plan.getCategory());
        existing.setStatus(plan.getStatus());
        existing.setStartDate(plan.getStartDate());
        existing.setEndDate(plan.getEndDate());
        return ResponseEntity.ok(ApiResponse.success(planRepository.save(existing), "Plan updated successfully"));
    }
}
