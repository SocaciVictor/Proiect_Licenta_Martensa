package com.martensa.userService.dto.response;

import java.util.List;

public record UserSummaryResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        List<String> roles
) {
}
