package com.his.bi.controller;

import com.his.bi.model.BenefitAccountEntity;
import com.his.bi.payload.response.ApiResponse;
import com.his.bi.repository.BenefitAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bi")
public class BiController {

    @Autowired
    private BenefitAccountRepository repository;

    @GetMapping("/status/{appId}")
    public ResponseEntity<ApiResponse<BenefitAccountEntity>> getStatus(@PathVariable Long appId) {
        return repository.findByAppId(appId)
                .map(account -> ResponseEntity.ok(ApiResponse.success(account, "Benefit account found")))
                .orElse(ResponseEntity.ok(ApiResponse.success(null, "No active benefit found")));
    }
}
