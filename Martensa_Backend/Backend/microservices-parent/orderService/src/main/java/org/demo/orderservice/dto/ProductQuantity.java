package org.demo.orderservice.dto;

public record ProductQuantity(
        Long productId,
        int quantity
) {
}
