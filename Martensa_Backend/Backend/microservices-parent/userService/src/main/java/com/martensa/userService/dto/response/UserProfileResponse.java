package com.martensa.userService.dto.response;

import java.time.LocalDate;
import java.util.List;

public record UserProfileResponse(
        String email,
        String firstName,
        String lastName,
        String address,
        String phoneNumber,
        LocalDate dateOfBirth,
        LoyaltyCardResponse loyaltyCard,
        List<String> roles
) {
}
