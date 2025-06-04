package org.demo.productservice.service.Impl;

import jakarta.transaction.Transactional;
import org.demo.productservice.dto.PromotionDto;
import org.demo.productservice.dto.PromotionRequest;
import org.demo.productservice.exception.ProductNotFoundException;
import org.demo.productservice.exception.PromotionNotFoundException;
import org.demo.productservice.mapper.ProductMapper;
import org.demo.productservice.mapper.PromotionMapper;
import org.demo.productservice.model.Product;
import org.demo.productservice.model.Promotion;
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

    public PromotionServiceImpl(PromotionRepository promotionRepository, ProductRepository productRepository,  PromotionMapper promotionMapper) {
        this.promotionRepository = promotionRepository;
        this.productRepository = productRepository;
        this.promotionMapper = promotionMapper;
    }

    @Override
    public void createPromotion(PromotionRequest request) {
        List<Product> products = productRepository.findAllById(request.productIds());

        if (products.size() != request.productIds().size()) {
            throw new ProductNotFoundException("Unul sau mai multe produse nu au fost găsite.");
        }

        Promotion promotion = Promotion.builder()
                .title(request.title())
                .description(request.description())
                .discountPercentage(request.discountPercentage())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .promotionType(request.promotionType())
                .products(products)
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

}
