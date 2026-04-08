package com.his.user.util;

import com.his.user.model.Role;
import com.his.user.model.RoleName;
import com.his.user.model.User;
import com.his.user.repository.RoleRepository;
import com.his.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DbInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DbInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Initialize Roles
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(null, RoleName.ROLE_USER));
            roleRepository.save(new Role(null, RoleName.ROLE_ADMIN));
            roleRepository.save(new Role(null, RoleName.ROLE_CASE_WORKER));
        }

        // Initialize Default Admin
        userRepository.findByEmail("admin@iecs.com").ifPresentOrElse(
            admin -> {
                admin.setPassword(passwordEncoder.encode("admin@123"));
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println(">>> System Administrator verified & password updated: admin@iecs.com");
            },
            () -> {
                Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Role Admin not found."));

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                User admin = User.builder()
                        .username("admin")
                        .email("admin@iecs.com")
                        .password(passwordEncoder.encode("admin@123"))
                        .enabled(true)
                        .roles(roles)
                        .build();

                userRepository.save(admin);
                System.out.println(">>> System Administrator created: admin@iecs.com / admin@123");
            }
        );
    }
}
