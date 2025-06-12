package org.demo.productservice.controller;

import jakarta.validation.Valid;
import org.demo.productservice.dto.CategoryResponse;
import org.demo.productservice.dto.ProductDetailsResponse;
import org.demo.productservice.dto.ProductRequest;
import org.demo.productservice.dto.ProductResponse;
import org.demo.productservice.service.CategoryService;
import org.demo.productservice.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(path = "/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Void> createProduct(@RequestBody @Valid ProductRequest request) {
        productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateProduct(@PathVariable Long id, @RequestBody @Valid ProductRequest request) {
        productService.updateProduct(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{id}")
    public List<ProductResponse> getProductsByCategory(@PathVariable Long id) {
        return productService.getProductsByCategory(id);
    }

    @GetMapping("/{id}/personalized")
    public ResponseEntity<ProductDetailsResponse> getProductByIdPersonalized(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.ok(productService.getProductByIdPersonalized(id, userId));
    }


}
