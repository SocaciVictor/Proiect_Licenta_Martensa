package org.demo.cartservice.exception;

public class ProductAlreadyInCartException extends RuntimeException {
    public ProductAlreadyInCartException(Long productId) {
        super("Product with ID " + productId + " is already in the cart.");
    }
}

