package org.demo.orderservice.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public record OrderCreatedEvent(
        Long orderId,
        Long userId,
        BigDecimal totalAmount,
        List<ProductQuantity> products,
        Long storeId,
        String paymentMethod
){
}
