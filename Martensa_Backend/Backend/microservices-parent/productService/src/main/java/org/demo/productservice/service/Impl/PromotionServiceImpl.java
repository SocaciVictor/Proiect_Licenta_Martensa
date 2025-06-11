package org.demo.productservice.service.Impl;

import jakarta.transaction.Transactional;
import org.demo.productservice.dto.PromotionDto;
import org.demo.productservice.dto.PromotionRequest;
import org.demo.productservice.exception.ProductNotFoundException;
import org.demo.productservice.exception.PromotionNotFoundException;
import org.demo.productservice.feign.UserClient;
import org.demo.productservice.mapper.ProductMapper;
import org.demo.productservice.mapper.PromotionMapper;
import org.demo.productservice.model.Product;
import org.demo.productservice.model.Promotion;
import org.demo.productservice.model.enums.PromotionType;
import org.demo.productservice.repository.ProductRepository;
import org.demo.productservice.repository.PromotionRepository;
import org.demo.productservice.service.PromotionService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

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
    public void createPromotion(PromotionRequest request) {
        List<Product> products = productRepository.findAllById(request.productIds());

        if (products.size() != request.productIds().size()) {
            throw new ProductNotFoundException("Unul sau mai multe produse nu au fost găsite.");
        }

        // ✅ dacă e CUSTOM, validăm userIds
        List<Long> validUserIds = List.of();
        if (request.promotionType() == PromotionType.CUSTOM && request.userIds() != null) {
            validUserIds = request.userIds().stream().map(userId -> {
                try {
                    userClient.getUserById(userId);
                    return userId;
                } catch (Exception e) {
                    throw new RuntimeException("User-ul cu id " + userId + " nu există!");
                }
            }).toList();
        }

        Promotion promotion = Promotion.builder()
                .title(request.title())
                .description(request.description())
                .discountPercentage(request.discountPercentage())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .promotionType(request.promotionType())
                .products(products)
                .userIds(validUserIds)
                .build();

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


}
