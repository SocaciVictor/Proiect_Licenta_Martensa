package org.demo.productservice.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("Product with id " + id + " not found.");
    }
    public ProductNotFoundException(String message) {
        super(message);
    }
}
