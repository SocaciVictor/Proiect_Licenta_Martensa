package org.demo.cartservice.dto.response;

import java.math.BigDecimal;

public record ProductDetailsResponse(
        Long id,
        String name,
        String description,
        String brand,
        BigDecimal price,
        BigDecimal discountPrice,
        String imageUrl,
        String barcode,
        String ingredients,
        String nutritionalInfo,
        String disclaimer,
        Double alcoholPercentage
) {
}
