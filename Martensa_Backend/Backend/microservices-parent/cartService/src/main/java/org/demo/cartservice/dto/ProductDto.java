package org.demo.cartservice.dto;

import java.math.BigDecimal;

public record ProductDto(
        Long id,
        String name,
        String brand,
        BigDecimal price,
        String imageUrl
) {
}
