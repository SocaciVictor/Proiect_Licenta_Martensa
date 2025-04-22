package com.martensa.userService.dto.request;

import jakarta.validation.constraints.*;

import java.util.List;

public record UserDto(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Encrypted password is required")
        String encryptedPassword,

        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotBlank(message = "Address is required")
        String address,

        @NotNull(message = "Role is required")
        List<@NotBlank String> roles
) {}