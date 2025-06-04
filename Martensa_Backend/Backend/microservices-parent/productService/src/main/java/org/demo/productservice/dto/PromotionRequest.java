package org.demo.productservice.dto;

import org.demo.productservice.model.enums.PromotionType;

import java.time.LocalDate;
import java.util.List;

public record PromotionRequest(
        String title,
        String description,
        int discountPercentage,
        LocalDate startDate,
        LocalDate endDate,
        PromotionType promotionType,
        List<Long> productIds
) {}
