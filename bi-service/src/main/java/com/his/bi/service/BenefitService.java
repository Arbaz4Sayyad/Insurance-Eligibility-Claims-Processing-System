package com.his.bi.service;

import com.his.bi.event.EligibilityDeterminedEvent;
import com.his.bi.model.BenefitAccountEntity;
import com.his.bi.repository.BenefitAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class BenefitService {

    @Autowired
    private BenefitAccountRepository accountRepository;

    public void issueBenefit(EligibilityDeterminedEvent event) {
        if (!event.getStatus().equalsIgnoreCase("APPROVED")) {
            return;
        }

        // Check if benefit already issued
        if (accountRepository.findByAppId(event.getAppId()).isPresent()) {
            return;
        }

        // Issue new Benefit Account (EBT Card logic)
        BenefitAccountEntity account = BenefitAccountEntity.builder()
                .appId(event.getAppId())
                .planName(event.getPlanName())
                .benefitAmount(event.getBenefitAmount())
                .accountNumber("EBT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(6)) // Valid for 6 months
                .status("ACTIVE")
                .build();
        
        accountRepository.save(account);
    }
}
