package org.demo.authservice.service;

import jakarta.validation.Valid;
import org.demo.authservice.dto.LoginRequest;
import org.demo.authservice.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    String register(RegisterRequest registerRequest);

    String login(@Valid LoginRequest request);

    boolean validateToken(String token);

    String getToken(String email);
}
