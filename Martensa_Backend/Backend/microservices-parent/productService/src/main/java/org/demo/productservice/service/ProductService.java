package org.demo.productservice.service;

import org.demo.productservice.dto.ProductDetailsResponse;
import org.demo.productservice.dto.ProductRequest;
import org.demo.productservice.dto.ProductResponse;

import java.util.List;


public interface ProductService {
    List<ProductResponse> getAllProducts();
    ProductDetailsResponse getProductById(Long id);
    ProductDetailsResponse getProductById(Long id, Long productId);
    void createProduct(ProductRequest request);
    void updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    List<ProductResponse> getProductsByCategory(Long id);
    ProductDetailsResponse getProductByIdPersonalized(Long id, Long userId);

}
