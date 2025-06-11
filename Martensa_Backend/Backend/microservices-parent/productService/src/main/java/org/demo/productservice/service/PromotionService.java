package org.demo.productservice.service;

import org.demo.productservice.dto.PromotionDto;
import org.demo.productservice.dto.PromotionRequest;

import java.util.List;


public interface PromotionService {
    void createPromotion(PromotionRequest request);
    List<PromotionDto> getPromotionsForProduct(Long productId);

    void deletePromotion(Long id);

    List<PromotionDto> getAllPromotions();

    List<PromotionDto> getPromotionsForUser(Long userId);
}
