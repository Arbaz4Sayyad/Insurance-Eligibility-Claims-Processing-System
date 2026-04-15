package com.his.user.security;

import com.his.user.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() throws Exception {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000);
        jwtUtils.init(); // Manually trigger key loading
    }

    @Test
    void testGenerateAndValidateToken() {
        UserDetailsImpl userPrincipal = mock(UserDetailsImpl.class);
        when(userPrincipal.getUsername()).thenReturn("testuser");
        when(userPrincipal.getId()).thenReturn(1L);
        doReturn(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
                .when(userPrincipal).getAuthorities();

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(userPrincipal);

        String token = jwtUtils.generateJwtToken(auth);
        assertNotNull(token);

        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("testuser", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void testInvalidToken() {
        assertFalse(jwtUtils.validateJwtToken("invalid-token-string"));
    }

    @Test
    void testEmptyToken() {
        assertFalse(jwtUtils.validateJwtToken(""));
    }
}
