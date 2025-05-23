package org.demo.cartservice.dto.request;

import jakarta.validation.constraints.NotNull;

public record RemoveProductRequest(
        @NotNull(message = "Product ID is required")
        Long productId
) {}

