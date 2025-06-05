package org.demo.storeservice.dto.request;

public record CreateOrUpdateStockRequest(
        Long productId,
        Integer quantity
) {
}
