package org.demo.paymentservice.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrderCreatedEvent(
        Long orderId,
        Long userId,
        BigDecimal totalAmount,
        List<ProductQuantity> products,
        Long storeId,
        String paymentMethod
) {
}
