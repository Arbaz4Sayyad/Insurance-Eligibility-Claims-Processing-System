package com.his.ed.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "eligibility_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appId;
    private String planName;
    private String status; // APPROVED, REJECTED
    private Double benefitAmount;
    private String denialReason;
    private LocalDateTime determinedAt;
}
