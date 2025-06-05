package org.demo.productservice.dto;

public record StoreProductStockResponse(
        Long storeId,
        Long productId,
        Integer quantity
) {
}
