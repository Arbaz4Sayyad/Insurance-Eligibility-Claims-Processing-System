package com.his.dc.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "income_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncomeRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private CaseEntity caseEntity;

    private Double amount;
    
    @Enumerated(EnumType.STRING)
    private IncomeType type;
}

enum IncomeType {
    WAGES,
    RENTAL,
    DIVIDENDS,
    BENEFITS
}
