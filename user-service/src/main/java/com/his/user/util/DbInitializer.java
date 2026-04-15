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

        // 1. Initialize Default Admin
        createOrUpdateUser("admin@iecs.com", "admin@iecs.com", "password", RoleName.ROLE_ADMIN);

        // 2. Initialize Default Caseworker
        createOrUpdateUser("caseworker@iecs.com", "caseworker@iecs.com", "password", RoleName.ROLE_CASE_WORKER);

        // 3. Initialize Default Citizen
        createOrUpdateUser("citizen@iecs.com", "citizen@iecs.com", "password", RoleName.ROLE_USER);
    }

    private void createOrUpdateUser(String username, String email, String password, RoleName roleName) {
        userRepository.findByEmail(email).ifPresentOrElse(
            user -> {
                user.setUsername(username);
                user.setPassword(passwordEncoder.encode(password));
                user.setEnabled(true);
                
                // Refresh roles to ensure correct sandbox access
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " not found."));
                Set<Role> roles = new HashSet<>();
                roles.add(role);
                user.setRoles(roles);
                
                userRepository.save(user);
                System.out.println(">>> User updated & roles refreshed: " + email + " (Role: " + roleName + ")");
            },
            () -> {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Error: Role " + roleName + " not found."));

                Set<Role> roles = new HashSet<>();
                roles.add(role);

                User user = User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .enabled(true)
                        .roles(roles)
                        .build();

                userRepository.save(user);
                System.out.println(">>> User created: " + email + " / " + password + " (Role: " + roleName + ")");
            }
        );
    }
}
