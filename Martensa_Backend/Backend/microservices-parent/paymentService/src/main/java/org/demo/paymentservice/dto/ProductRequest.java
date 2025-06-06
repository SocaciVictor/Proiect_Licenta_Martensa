package org.demo.paymentservice.dto;

import java.math.BigDecimal;

public record ProductRequest(
        BigDecimal amount,
        Long quantity,
        String Name,
        String Currency
) {
}
