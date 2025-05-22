package org.demo.productservice.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String name,
        String description,
        String brand,

        @NotNull @DecimalMin("0.00") BigDecimal price,
        BigDecimal discountPrice,

        String imageUrl,
        String barcode,
        String ingredients,
        String nutritionalInfo,
        String disclaimer,

        @DecimalMin("0.0") @DecimalMax("100.0") Double alcoholPercentage,

        @NotNull Long categoryId
) {
}
