package com.his.co.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoNoticeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appId;
    private String citizenName;
    private String status; // APPROVED, REJECTED
    private String message;
    private String filePath;
    @Builder.Default
    private boolean isRead = false;
    private LocalDateTime sentAt;
}
