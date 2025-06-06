package org.demo.orderservice.dto;

import org.demo.orderservice.model.enums.PaymentStatus;

import java.math.BigDecimal;
import java.util.List;

public record PaymentCompletedEvent(
        Long orderId,
        Long userId,
        BigDecimal amount,
        List<ProductQuantity> products,
        PaymentStatus status
) {
}
