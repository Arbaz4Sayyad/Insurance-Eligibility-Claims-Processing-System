package com.his.ar.event;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ApplicationCreatedEvent extends BaseEvent {
    private Long citizenId;
    private String status;
}
