package org.demo.paymentservice.dto;


import org.demo.paymentservice.model.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentResponse(
        Long id,
        Long orderId,
        UserSummaryResponse userSummaryResponse,
        BigDecimal amount,
        PaymentStatus status,
        String method,
        LocalDate paymentDate
) {
}
