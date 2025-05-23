package com.martensa.userService.dto.request;

public record UserUpdateRequest(
        String firstName,
        String lastName,
        String phoneNumber,
        String address
) {
}
