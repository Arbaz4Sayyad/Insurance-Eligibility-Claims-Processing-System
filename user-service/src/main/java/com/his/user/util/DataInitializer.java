package com.his.user.util;

import com.his.user.model.Role;
import com.his.user.model.RoleName;
import com.his.user.model.User;
import com.his.user.repository.RoleRepository;
import com.his.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Roles if they don't exist
        for (RoleName roleName : RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(new Role(null, roleName));
            }
        }

        // 2. Add an Admin if none exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role Admin is not found."));
            
            User admin = User.builder()
                    .username("admin")
                    .email("admin@his.com")
                    .password(encoder.encode("admin123"))
                    .roles(new HashSet<>(Collections.singletonList(adminRole)))
                    .enabled(true)
                    .build();
            userRepository.save(admin);
        }

        // 3. Add a Caseworker if none exists
        if (userRepository.findByUsername("caseworker").isEmpty()) {
            Role cwRole = roleRepository.findByName(RoleName.ROLE_CASE_WORKER)
                    .orElseThrow(() -> new RuntimeException("Error: Role Caseworker is not found."));
            
            User caseworker = User.builder()
                    .username("caseworker")
                    .email("caseworker@his.com")
                    .password(encoder.encode("staff123"))
                    .roles(new HashSet<>(Collections.singletonList(cwRole)))
                    .enabled(true)
                    .build();
            userRepository.save(caseworker);
        }

        // 4. Add a Citizen if none exists
        if (userRepository.findByUsername("citizen").isEmpty()) {
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role User is not found."));
            
            User citizen = User.builder()
                    .username("citizen")
                    .email("citizen@his.com")
                    .password(encoder.encode("citizen123"))
                    .roles(new HashSet<>(Collections.singletonList(userRole)))
                    .enabled(true)
                    .build();
            userRepository.save(citizen);
        }
    }
}
