package com.his.user.service;

import com.his.user.model.Role;
import com.his.user.model.RoleName;
import com.his.user.model.User;
import com.his.user.payload.request.ProfileUpdateRequest;
import com.his.user.repository.RoleRepository;
import com.his.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder encoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testworker")
                .email("test@his.com")
                .enabled(true)
                .build();
    }

    @Test
    void testCreateCaseworker_Success() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_CASE_WORKER))
                .thenReturn(Optional.of(new Role(1L, RoleName.ROLE_CASE_WORKER)));
        when(encoder.encode(anyString())).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.createCaseworker("testworker", "test@his.com", "password");

        assertNotNull(result);
        assertEquals("testworker", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateCaseworker_AlreadyExists() {
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> 
            userService.createCaseworker("testworker", "test@his.com", "password")
        );
    }

    @Test
    void testToggleUserStatus() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        boolean result = userService.toggleUserStatus(1L, false);
        
        assertTrue(result);
        assertFalse(testUser.isEnabled());
        verify(userRepository).save(testUser);
    }

    @Test
    void testUpdateProfile() {
        ProfileUpdateRequest updatedData = new ProfileUpdateRequest();
        updatedData.setFirstName("John");
        updatedData.setLastName("Doe");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.updateProfile(1L, updatedData);

        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
    }
}
