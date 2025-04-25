package org.demo.authservice.service;

import jakarta.validation.Valid;
import org.demo.authservice.dto.AuthResponse;
import org.demo.authservice.dto.LoginRequest;
import org.demo.authservice.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);

    AuthResponse login(@Valid LoginRequest request);

    boolean validateToken(String token);

    AuthResponse getToken(String email);
}
