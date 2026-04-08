package com.his.dc.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "expense_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private CaseEntity caseEntity;

    private String expenseType;
    private Double amount;
}
