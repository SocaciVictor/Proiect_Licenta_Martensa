package org.demo.paymentservice.dto;

import java.math.BigDecimal;
import java.util.List;

public record StripeCheckoutRequest(
        Long orderId,
        Long userId,
        BigDecimal amount,
        List<StripeProductRequest> products
) {}



