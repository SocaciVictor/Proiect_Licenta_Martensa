package org.demo.productservice.service.Impl;

import org.demo.productservice.dto.ProductDetailsResponse;
import org.demo.productservice.dto.ProductRequest;
import org.demo.productservice.dto.ProductResponse;
import org.demo.productservice.exception.CategoryNotFoundException;
import org.demo.productservice.exception.ProductNotFoundException;
import org.demo.productservice.mapper.ProductMapper;
import org.demo.productservice.model.Category;
import org.demo.productservice.model.Product;
import org.demo.productservice.repository.CategoryRepository;
import org.demo.productservice.repository.ProductRepository;
import org.demo.productservice.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository, ProductMapper productMapper, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.categoryRepository = categoryRepository;
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
    public ProductDetailsResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(productMapper::toProductDetails)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productMapper.toProductResponseList(productRepository.findAll());
    }

    @Override
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
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productRepository.delete(product);
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long id) {
        return productMapper.toProductResponseList(productRepository.findAllByCategoryId(id));
    }
}
