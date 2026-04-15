package com.his.ed.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RuleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private PlanEntity plan;

    @Column(nullable = false)
    private String conditionExpression; 

    private Double benefitAmount; 
    private String denialReason;
    
    @Column(name = "rule_version")
    private Integer version = 1;
    
    private String description;
}
