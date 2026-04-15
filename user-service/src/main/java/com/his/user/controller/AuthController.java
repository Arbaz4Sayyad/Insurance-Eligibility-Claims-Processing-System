package com.his.user.controller;

import com.his.user.model.Role;
import com.his.user.model.RoleName;
import com.his.user.model.User;
import com.his.user.payload.request.LoginRequest;
import com.his.user.payload.request.SignupRequest;
import com.his.user.payload.response.ApiResponse;
import com.his.user.payload.response.LoginResponse;
import com.his.user.repository.RoleRepository;
import com.his.user.repository.UserRepository;
import com.his.user.security.JwtUtils;
import com.his.user.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Map Spring Security roles to Frontend roles (ADMIN, CASEWORKER, CITIZEN)
        String role = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .map(r -> {
                    if (r.equals("ROLE_ADMIN")) return "ADMIN";
                    if (r.equals("ROLE_CASE_WORKER")) return "CASEWORKER";
                    return "CITIZEN";
                })
                .findFirst()
                .orElse("CITIZEN");

        LoginResponse data = LoginResponse.builder()
                .token(jwt)
                .role(role)
                .userId(userDetails.getId())
                .expiresAt(jwtUtils.getExpirationDateFromJwtToken(jwt).toString())
                .build();

        return ResponseEntity.ok(ApiResponse.success(data, "Login successful"));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Object>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
             return ResponseEntity.badRequest().body(
                 ApiResponse.error("BAD_REQUEST", "Username is already taken!", "Registration failed")
             );
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(
                 ApiResponse.error("BAD_REQUEST", "Email is already in use!", "Registration failed")
             );
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .enabled(true)
                .build();

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            // Public signup only allows ROLE_USER
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(null, "User registered successfully!"));
    }
}
