package com.his.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String status;

    private Long userId;

    @Column(length = 1000)
    private String details;
}
