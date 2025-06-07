package org.demo.orderservice.dto.request;

public record ProductOrderRequest(
        Long productId,
        int quantity
) {
}
