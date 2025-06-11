package com.martensa.userService.dto;

import java.math.BigDecimal;

public record LoyaltyPointsEvent(
        Long userId,
        BigDecimal amountPaid
) {
}
