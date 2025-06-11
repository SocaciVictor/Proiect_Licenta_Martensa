package org.demo.paymentservice.dto;

public record UserSummaryResponse(
        Long id,
        String email,
        String firstName,
        String lastName
) {
}
