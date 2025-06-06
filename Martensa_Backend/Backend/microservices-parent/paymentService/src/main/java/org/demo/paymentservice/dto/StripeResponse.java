package org.demo.paymentservice.dto;

public record StripeResponse(
        String status,
        String message,
        String sessionId,
        String sessionUrl
) {
}
