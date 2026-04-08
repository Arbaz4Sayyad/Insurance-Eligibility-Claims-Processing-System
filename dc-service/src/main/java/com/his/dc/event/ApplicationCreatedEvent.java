package com.his.dc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationCreatedEvent {
    private Long appId;
    private Long citizenId;
    private String status;
}
