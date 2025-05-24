package org.demo.orderservice.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrderCreatedEvent(
        Long orderId,
        Long userId,
        BigDecimal totalAmount,
        List<Long> productIds,
        String paymentMethod
) {
}
