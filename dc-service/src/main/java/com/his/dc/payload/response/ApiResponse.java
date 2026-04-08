package com.his.dc.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private ApiError error;
    @Builder.Default
    private String timestamp = LocalDateTime.now().toString();

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> error(String code, String details, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(new ApiError(code, details))
                .build();
    }
}
