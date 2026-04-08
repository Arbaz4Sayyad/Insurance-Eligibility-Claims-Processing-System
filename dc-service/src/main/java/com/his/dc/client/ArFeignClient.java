package com.his.dc.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ar-service", url = "${dc.validation.client.url}")
public interface ArFeignClient {
    
    @GetMapping("/api/ar/validate/{appId}")
    Boolean validateAppId(@PathVariable("appId") Long appId);
}
