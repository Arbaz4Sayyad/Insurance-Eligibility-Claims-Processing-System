package com.his.ed.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseFact {
    private Long appId;
    private Integer age;
    private String gender;
    private Double totalIncome;
    private Integer householdSize;
    private Boolean hasChildren;
}
