package com.his.user.service;

import com.his.user.model.Role;
import com.his.user.model.RoleName;
import com.his.user.model.User;
import com.his.user.payload.request.ProfileUpdateRequest;
import com.his.user.payload.response.UserStatsDTO;
import com.his.user.repository.RoleRepository;
import com.his.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(RoleName roleName) {
        return userRepository.findAllByRoles_Name(roleName);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createCaseworker(String username, String email, String password) {
        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            throw new RuntimeException("Error: Username or Email is already taken!");
        }

        Role cwRole = roleRepository.findByName(RoleName.ROLE_CASE_WORKER)
                .orElseThrow(() -> new RuntimeException("Error: Role not found."));

        Set<Role> roles = new HashSet<>();
        roles.add(cwRole);

        User user = User.builder()
                .username(username)
                .email(email)
                .password(encoder.encode(password))
                .enabled(true)
                .roles(roles)
                .build();

        return userRepository.save(user);
    }

    public boolean toggleUserStatus(Long id, boolean enabled) {
        return userRepository.findById(id).map(user -> {
            user.setEnabled(enabled);
            userRepository.save(user);
            return true;
        }).orElse(false);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserStatsDTO getUserStats() {
        return UserStatsDTO.builder()
                .totalUsers(userRepository.count())
                .activeCaseworkers(userRepository.countByRoles_Name(RoleName.ROLE_CASE_WORKER))
                .build();
    }

    public User updateProfile(Long id, ProfileUpdateRequest profileData) {
        return userRepository.findById(id).map(user -> {
            if (profileData.getEmail() != null) user.setEmail(profileData.getEmail());
            if (profileData.getUsername() != null) user.setUsername(profileData.getUsername());
            if (profileData.getFirstName() != null) user.setFirstName(profileData.getFirstName());
            if (profileData.getLastName() != null) user.setLastName(profileData.getLastName());
            if (profileData.getPhone() != null) user.setPhone(profileData.getPhone());
            if (profileData.getAddress() != null) user.setAddress(profileData.getAddress());
            if (profileData.getCity() != null) user.setCity(profileData.getCity());
            if (profileData.getState() != null) user.setState(profileData.getState());
            if (profileData.getZip() != null) user.setZip(profileData.getZip());
            if (profileData.getSsn() != null) user.setSsn(profileData.getSsn());
            if (profileData.getPreferences() != null) user.setPreferences(profileData.getPreferences());
            if (profileData.getMfaEnabled() != null) user.setMfaEnabled(profileData.getMfaEnabled());
            
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
