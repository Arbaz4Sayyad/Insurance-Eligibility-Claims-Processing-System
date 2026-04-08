package com.his.dc.event;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DataCapturedEvent extends BaseEvent {
    private String status; // COMPLETED
}
