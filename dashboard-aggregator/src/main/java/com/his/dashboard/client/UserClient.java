package com.his.dashboard.client;

import com.his.dashboard.dto.ApiResponse;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/users/stats/counts")
    ApiResponse<UserStatsResponse> getUserStats();

    @Data
    class UserStatsResponse {
        private long totalUsers;
        private long activeCaseworkers;
    }
}
