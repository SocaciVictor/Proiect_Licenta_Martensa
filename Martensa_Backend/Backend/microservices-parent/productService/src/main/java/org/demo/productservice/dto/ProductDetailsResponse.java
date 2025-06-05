package org.demo.productservice.dto;

import java.math.BigDecimal;
import java.util.List;

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
        Double alcoholPercentage,
        String categoryName,
        List<PromotionDto> promotions,
        Integer quantity
) {
}
