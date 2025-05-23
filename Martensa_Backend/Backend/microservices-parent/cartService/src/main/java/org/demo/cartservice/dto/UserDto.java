package org.demo.cartservice.dto;

public record UserDto(
        Long id,
        String email,
        String firstName,
        String lastName
) {
}
