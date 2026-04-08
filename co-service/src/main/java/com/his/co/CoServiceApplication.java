package com.his.co;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class CoServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoServiceApplication.class, args);
    }
}
