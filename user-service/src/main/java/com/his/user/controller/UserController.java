package com.his.user.controller;

import com.his.user.model.RoleName;
import com.his.user.model.User;
import com.his.user.payload.request.SignupRequest;
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
        if ("CASE_WORKER".equals(role)) {
            return ResponseEntity.ok(userService.getUsersByRole(RoleName.ROLE_CASE_WORKER));
        }
        return ResponseEntity.ok(userService.getAllUsers());
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
}
