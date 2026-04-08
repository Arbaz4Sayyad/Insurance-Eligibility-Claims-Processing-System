package com.his.ed.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "plans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
    
    private String description;
    private boolean active = true;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL)
    private List<RuleEntity> rules;
}
