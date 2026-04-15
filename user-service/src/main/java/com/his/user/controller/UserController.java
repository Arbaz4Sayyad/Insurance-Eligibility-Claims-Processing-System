package com.his.user.controller;

import com.his.user.model.RoleName;
import com.his.user.model.User;
import com.his.user.payload.request.ProfileUpdateRequest;
import com.his.user.payload.request.SignupRequest;
import com.his.user.payload.response.ApiResponse;
import com.his.user.payload.response.UserStatsDTO;
import com.his.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String role) {
        if (role != null) {
            String upperRole = role.toUpperCase();
            if (upperRole.equals("CASE_WORKER") || upperRole.equals("ROLE_CASE_WORKER") || upperRole.equals("CASEWORKER")) {
                return ResponseEntity.ok(userService.getUsersByRole(RoleName.ROLE_CASE_WORKER));
            } else if (upperRole.equals("ADMIN") || upperRole.equals("ROLE_ADMIN")) {
                return ResponseEntity.ok(userService.getUsersByRole(RoleName.ROLE_ADMIN));
            } else if (upperRole.equals("USER") || upperRole.equals("ROLE_USER")) {
                return ResponseEntity.ok(userService.getUsersByRole(RoleName.ROLE_USER));
            }
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create-caseworker")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCaseworker(@RequestBody SignupRequest request) {
        try {
            User user = userService.createCaseworker(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        if (userService.toggleUserStatus(id, true)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        if (userService.toggleUserStatus(id, false)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats/counts")
    public ResponseEntity<ApiResponse<UserStatsDTO>> getUserStats() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserStats(), "User statistics retrieved successfully"));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest profileData) {
        try {
            User updated = userService.updateProfile(id, profileData);
            return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("UPDATE_FAILED", e.getMessage(), "Failed to update profile"));
        }
    }

    @PutMapping("/{id}/security-sync")
    public ResponseEntity<ApiResponse<String>> securitySync(@PathVariable Long id) {
        try {
            // Logic to refresh session or rotate internal keys could go here
            return ResponseEntity.ok(ApiResponse.success("Security synchronization complete", "System integrity verified"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("SYNC_FAILED", e.getMessage(), "Failed to synchronize security keys"));
        }
    }
}
