package org.demo.orderservice.dto;

import org.demo.orderservice.model.enums.PaymentStatus;

import java.math.BigDecimal;

public record PaymentCompletedEvent(
        Long orderId,
        Long userId,
        BigDecimal amount,
        PaymentStatus status
) {
}
