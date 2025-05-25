package org.demo.orderservice.dto;

import java.math.BigDecimal;

public record OrderItemDto(
        Long productId,
        String productName,
        BigDecimal price,
        int quantity
) {
}
