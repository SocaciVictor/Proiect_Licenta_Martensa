package org.demo.cartservice.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long productId) {
        super("Product with ID " + productId + " not found in external service.");
    }
}
