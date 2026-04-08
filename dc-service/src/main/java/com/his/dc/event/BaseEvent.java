package com.his.dc.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public abstract class BaseEvent {
    @Builder.Default
    private String eventId = UUID.randomUUID().toString();
    private String eventType;
    private Long appId;
    @Builder.Default
    private String timestamp = LocalDateTime.now().toString();
}
