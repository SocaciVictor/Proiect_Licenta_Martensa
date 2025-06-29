package org.demo.productservice.service.Impl;

import jakarta.transaction.Transactional;
import org.demo.productservice.dto.ProductDetailsResponse;
import org.demo.productservice.dto.ProductRequest;
import org.demo.productservice.dto.ProductResponse;
import org.demo.productservice.dto.PromotionDto;
import org.demo.productservice.exception.CategoryNotFoundException;
import org.demo.productservice.exception.ProductNotFoundException;
import org.demo.productservice.mapper.ProductMapper;
import org.demo.productservice.mapper.PromotionMapper;
import org.demo.productservice.model.Category;
import org.demo.productservice.model.Product;
import org.demo.productservice.model.enums.PromotionType;
import org.demo.productservice.repository.CategoryRepository;
import org.demo.productservice.repository.ProductRepository;
import org.demo.productservice.service.ProductService;
import org.springframework.stereotype.Service;
import org.demo.productservice.feign.StoreServiceClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final PromotionMapper  promotionMapper;
    private final StoreServiceClient storeServiceClient;

    public ProductServiceImpl(ProductRepository productRepository, ProductMapper productMapper, CategoryRepository categoryRepository,
                              PromotionMapper promotionMapper,  StoreServiceClient storeServiceClient) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.categoryRepository = categoryRepository;
        this.promotionMapper = promotionMapper;
        this.storeServiceClient = storeServiceClient;
    }

    @Override
    public void createProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        Product product = productMapper.toProduct(request);
        product.setCategory(category);

        productRepository.save(product);
    }

    @Override
    @Transactional
    public ProductDetailsResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    List<PromotionDto> promotionDtos = product.getPromotions().stream()
                            .filter(p -> !p.getEndDate().isBefore(LocalDate.now()))
                            .map(promotionMapper::toDto)
                            .toList();

                    if (!promotionDtos.isEmpty()) {
                        PromotionDto promo = promotionDtos.get(0);
                        BigDecimal discount = product.getPrice()
                                .multiply(BigDecimal.valueOf(promo.discountPercentage()))
                                .divide(BigDecimal.valueOf(100));

                        product.setDiscountPrice(product.getPrice().subtract(discount));
                    } else {
                        product.setDiscountPrice(null);
                    }

                    return productMapper.toProductDetails(product, promotionDtos);
                })
                .orElseThrow(() -> new ProductNotFoundException(id));
    }




    @Override
    @Transactional
    public ProductDetailsResponse getProductById(Long id, Long storeId) {
        return productRepository.findById(id)
                .map(product -> {
                    List<PromotionDto> promotionDtos = product.getPromotions().stream()
                            .filter(p ->
                                    !p.getEndDate().isBefore(LocalDate.now()))
                            .map(promotionMapper::toDto)
                            .toList();

                    if (!promotionDtos.isEmpty()) {
                        PromotionDto promo = promotionDtos.get(0);
                        BigDecimal discount = product.getPrice()
                                .multiply(BigDecimal.valueOf(promo.discountPercentage()))
                                .divide(BigDecimal.valueOf(100));

                        product.setDiscountPrice(product.getPrice().subtract(discount));
                    } else {
                        product.setDiscountPrice(null);
                    }

                    Integer quantity = null;
                    if (storeId != null) {
                        try {
                            var stock = storeServiceClient.getStockForProduct(storeId, product.getId());
                            quantity = stock.quantity();
                        } catch (Exception e) {
                            quantity = null; // sau loghezi fallback
                        }
                    }

                    return productMapper.toProductDetails(product, promotionDtos, quantity);
                })
                .orElseThrow(() -> new ProductNotFoundException(id));
    }




    @Override
    @Transactional
    public List<ProductResponse> getAllProducts() {
        return productMapper.toProductResponseList(productRepository.findAll());
    }

    @Override
    @Transactional
    public void updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        productMapper.updateProductFromRequest(request, product);
        product.setCategory(category);

        productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productRepository.delete(product);
    }

    @Override
    @Transactional
    public List<ProductResponse> getProductsByCategory(Long id) {
        return productMapper.toProductResponseList(productRepository.findAllByCategoryId(id));
    }

    @Override
    @Transactional
    public ProductDetailsResponse getProductByIdPersonalized(Long id, Long userId) {
        return productRepository.findById(id)
                .map(product -> {
                    List<PromotionDto> promotionDtos = product.getPromotions().stream()
                            .filter(p ->
                                    !p.getEndDate().isBefore(LocalDate.now()) &&
                                    (p.getPromotionType() == PromotionType.ALL ||
                                            (p.getPromotionType() == PromotionType.CUSTOM &&
                                                    p.getUserIds() != null && p.getUserIds().contains(userId))))
                            .map(promotionMapper::toDto)
                            .toList();

                    if (!promotionDtos.isEmpty()) {
                        PromotionDto promo = promotionDtos.get(0);
                        BigDecimal discount = product.getPrice()
                                .multiply(BigDecimal.valueOf(promo.discountPercentage()))
                                .divide(BigDecimal.valueOf(100));

                        product.setDiscountPrice(product.getPrice().subtract(discount));
                    } else {
                        product.setDiscountPrice(null);
                    }

                    return productMapper.toProductDetails(product, promotionDtos);
                })
                .orElseThrow(() -> new ProductNotFoundException(id));
    }


}
