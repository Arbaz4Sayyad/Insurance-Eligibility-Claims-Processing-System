package com.his.dc.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "household_members")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private CaseEntity caseEntity;

    private String firstName;
    private String lastName;
    private String relationship;
}
