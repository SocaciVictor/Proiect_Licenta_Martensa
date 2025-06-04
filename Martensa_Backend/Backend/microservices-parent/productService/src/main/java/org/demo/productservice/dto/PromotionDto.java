package org.demo.productservice.dto;

import org.demo.productservice.model.enums.PromotionType;

import java.time.LocalDate;

public record PromotionDto(
        Long id,
        String title,
        String description,
        int discountPercentage,
        LocalDate startDate,
        LocalDate endDate,
        PromotionType promotionType
) {
}
