package org.demo.authservice.service;

import jakarta.validation.Valid;
import org.demo.authservice.dto.LoginRequest;
import org.demo.authservice.dto.RegisterRequest;

public interface AuthService {
    String register(RegisterRequest registerRequest);

    String login(@Valid LoginRequest request);

    boolean validateToken(String token);
}
