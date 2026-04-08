package com.his.bi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class BiServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(BiServiceApplication.class, args);
    }
}
