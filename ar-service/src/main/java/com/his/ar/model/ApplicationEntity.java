package com.his.ar.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "citizen_id", referencedColumnName = "id")
    private CitizenEntity citizen;

    private String caseStatus; // PENDING, APPROVED, REJECTED

    @Enumerated(EnumType.STRING)
    private WorkflowStatus workflowStatus;

    private LocalDateTime createdAt;
    private String createdBy; // Case Worker Username
}
