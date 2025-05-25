package org.demo.paymentservice.dto;

import org.demo.paymentservice.model.enums.PaymentStatus;

import java.io.Serializable;
import java.math.BigDecimal;

public record PaymentCompletedEvent(
        Long orderId,
        Long userId,
        BigDecimal amount,
        PaymentStatus status
) {
}
