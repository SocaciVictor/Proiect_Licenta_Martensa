package org.demo.productservice.dto;

import org.demo.productservice.model.enums.PromotionType;

import java.time.LocalDate;
import java.util.List;

public record PromotionResponse(
        Long id,
        String title,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        int discountPercentage,
        List<Long> productIds,
        PromotionType promotionType
) {
}
