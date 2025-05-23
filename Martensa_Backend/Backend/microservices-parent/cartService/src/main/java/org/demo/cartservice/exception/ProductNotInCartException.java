package org.demo.cartservice.exception;

public class ProductNotInCartException extends RuntimeException {
    public ProductNotInCartException(Long productId) {
        super("Product with ID " + productId + " is not in the cart.");
    }
}

