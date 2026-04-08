package com.his.dc.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "cases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long caseId;

    @Column(unique = true, nullable = false)
    private Long appId;

    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL)
    private List<HouseholdMember> householdMembers;

    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL)
    private List<IncomeRecord> incomeRecords;

    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL)
    private List<ExpenseRecord> expenseRecords;
}
