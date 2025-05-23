package com.martensa.userService.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record UserDto(

        @Null
        Long id,
        @NotBlank String email,
        @NotBlank String password,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String address,
        @NotBlank String phoneNumber,
        @JsonFormat(pattern = "yyyy-MM-dd")
        @NotNull LocalDate dateOfBirth,
        List<String> roles

) {}
