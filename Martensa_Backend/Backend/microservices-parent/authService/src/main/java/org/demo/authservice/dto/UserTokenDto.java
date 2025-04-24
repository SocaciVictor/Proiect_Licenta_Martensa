package org.demo.authservice.dto;

import jakarta.validation.constraints.NotBlank;

public record UserTokenDto(
       @NotBlank String email
) {
}
