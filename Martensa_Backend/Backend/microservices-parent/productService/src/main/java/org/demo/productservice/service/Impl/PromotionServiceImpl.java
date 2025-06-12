package org.demo.productservice.service.Impl;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.demo.productservice.dto.PromotionDto;
import org.demo.productservice.dto.PromotionRequest;
import org.demo.productservice.dto.UserDto;
import org.demo.productservice.exception.ProductNotFoundException;
import org.demo.productservice.exception.PromotionNotFoundException;
import org.demo.productservice.feign.UserClient;
import org.demo.productservice.mapper.PromotionMapper;
import org.demo.productservice.model.Product;
import org.demo.productservice.model.Promotion;
import org.demo.productservice.model.enums.PromotionType;
import org.demo.productservice.repository.ProductRepository;
import org.demo.productservice.repository.PromotionRepository;
import org.demo.productservice.service.PromotionService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class PromotionServiceImpl implements PromotionService {
    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;
    private final PromotionMapper promotionMapper;
    private final UserClient  userClient;

    public PromotionServiceImpl(PromotionRepository promotionRepository, ProductRepository productRepository,  PromotionMapper promotionMapper,  UserClient userClient) {
        this.promotionRepository = promotionRepository;
        this.productRepository = productRepository;
        this.promotionMapper = promotionMapper;
        this.userClient = userClient;
    }

    @Override
    @Transactional
    public void createPromotion(PromotionRequest request) {
        Promotion promotion = Promotion.builder()
                .title(request.title())
                .description(request.description())
                .discountPercentage(request.discountPercentage())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .promotionType(request.promotionType())
                .products(productRepository.findAllById(request.productIds()))
                .build();

        // SAFE pentru userIds:
        if (request.userIds() == null || request.userIds().isEmpty()) {
            promotion.setUserIds(Collections.emptyList());
        } else {
            // eliminăm eventualele null-uri:
            List<Long> safeUserIds = request.userIds().stream()
                    .filter(Objects::nonNull)
                    .toList();
            promotion.setUserIds(safeUserIds);
        }

        promotionRepository.save(promotion);
    }


    @Override
    @Transactional
    public List<PromotionDto> getPromotionsForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Produsul cu ID " + productId + " nu a fost găsit."));

        return product.getPromotions().stream()
                .filter(p -> !p.getStartDate().isAfter(LocalDate.now()) &&
                        !p.getEndDate().isBefore(LocalDate.now()))
                .map(promotionMapper::toDto)
                .toList();
    }

    @Override
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new PromotionNotFoundException("Promoția cu ID " + id + " nu există.");
        }
        promotionRepository.deleteById(id);
    }

    @Override
    @Transactional()
    public List<PromotionDto> getAllPromotions() {
        List<Promotion> promotions = promotionRepository.findAll();
        return promotionMapper.toPromotionDtoList(promotions);
    }

    @Override
    @Transactional
    public List<PromotionDto> getPromotionsForUser(Long userId) {
        List<Promotion> promotions = promotionRepository.findAll();

        return promotionMapper.toPromotionDtoList(
                promotions.stream()
                        .filter(promo -> promo.getPromotionType() == PromotionType.ALL ||
                                (promo.getPromotionType() == PromotionType.CUSTOM &&
                                        promo.getUserIds() != null &&
                                        promo.getUserIds().contains(userId)))
                        .toList()
        );
    }

    @Override
    @Transactional
    public void activatePromotionForUser(Long promotionId, Long userId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new PromotionNotFoundException("Promoția cu ID " + promotionId + " nu există."));

        UserDto user = userClient.getUserById(userId);

        if (promotion.getPromotionType() != PromotionType.CUSTOM) {
            throw new IllegalArgumentException("Promoția nu poate fi activată manual (nu este de tip CUSTOM).");
        }

        if (promotion.getUserIds().contains(userId)) {
            throw new IllegalArgumentException("Promoția a fost deja activată de acest utilizator.");
        }

        userClient.deductLoyaltyPoints(userId, 1000);

        promotion.getUserIds().add(userId);
        promotionRepository.save(promotion);
    }

    @Override
    @Transactional
    public List<PromotionDto> getAvailableCustomPromotionsForUser(Long userId) {
        List<Promotion> promotions = promotionRepository.findAll();

       return promotionMapper.toPromotionDtoList(
                promotions.stream()
                        .filter(promo -> promo.getPromotionType() == PromotionType.CUSTOM)
                        .filter(promo -> {
                            List<Long> userIds = promo.getUserIds();

                            if (userIds == null || userIds.isEmpty()) {
                                return true;
                            }

                            return userIds.stream()
                                    .filter(id -> id != null)
                                    .noneMatch(id -> id.equals(userId));
                        })
                        .filter(promo ->
                                        !promo.getEndDate().isBefore(LocalDate.now())
                        )
                        .toList()
        );
    }


}
