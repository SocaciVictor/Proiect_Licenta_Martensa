package org.demo.storeservice.dto.response;

public record MissingStockDto(
        Long productId,
        String message
) {}
