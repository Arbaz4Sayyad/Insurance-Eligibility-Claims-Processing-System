package com.his.analytics.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EligibilityDeterminedEvent {
    private Long appId;
    private String planName;
    private String status;
    private Double benefitAmount;
}
