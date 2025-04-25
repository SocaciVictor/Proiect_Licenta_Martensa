package org.demo.authservice.dto;

public record AuthResponse(
        String token,
        String refreshToken
) {
}
