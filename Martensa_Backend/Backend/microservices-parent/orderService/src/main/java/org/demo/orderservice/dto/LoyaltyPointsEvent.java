package org.demo.orderservice.dto;

import java.math.BigDecimal;

public record LoyaltyPointsEvent(
        Long userId,
        BigDecimal amountPaid
) {
}
