package com.his.bi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "benefit_accounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenefitAccountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appId;
    private String planName;
    private Double benefitAmount;
    
    private String accountNumber; // EBT Card or Policy Number
    
    private LocalDate startDate;
    private LocalDate endDate;
    private String status; // ACTIVE, TERMINATED
}
