package org.demo.paymentservice.dto;

public record ProductQuantity(
        Long productId,
        int quantity
) {
}
