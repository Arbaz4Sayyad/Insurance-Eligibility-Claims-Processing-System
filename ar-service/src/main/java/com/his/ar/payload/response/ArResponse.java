package com.his.ar.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ArResponse {
    private Long appId;
    private String status;
    private String message;
}
