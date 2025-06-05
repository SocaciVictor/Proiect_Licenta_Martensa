package org.demo.orderservice.dto;

import java.math.BigDecimal;

public record ProductDTO(
        Long id,
        String name,
        BigDecimal price,
        BigDecimal discountPrice,
        String description
) {

}

