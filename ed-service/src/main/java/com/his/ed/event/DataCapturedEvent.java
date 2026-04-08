package com.his.ed.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataCapturedEvent {
    private Long appId;
    private String status; // COMPLETED
}
