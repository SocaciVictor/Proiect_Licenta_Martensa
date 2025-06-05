package org.demo.storeservice.dto;

public record StoreProductStockDto(
        Long id,
        Long storeId,
        Long productId,
        Integer quantity
) {
}
