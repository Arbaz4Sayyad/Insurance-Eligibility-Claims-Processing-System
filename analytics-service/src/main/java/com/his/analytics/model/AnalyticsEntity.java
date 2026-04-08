package com.his.analytics.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appId;
    private String eventType; // APP_CREATED, DATA_CAPTURED, ELIGIBILITY_DETERMINED
    private String details; // JSON or formatted summary
    private LocalDateTime timestamp;
}
