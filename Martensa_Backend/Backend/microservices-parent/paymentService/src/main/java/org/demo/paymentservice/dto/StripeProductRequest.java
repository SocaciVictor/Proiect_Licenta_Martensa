package org.demo.paymentservice.dto;

import java.math.BigDecimal;

public record StripeProductRequest(
        Long productId,
        String name,
        BigDecimal amount,
        Long quantity,
        String currency
) {}
