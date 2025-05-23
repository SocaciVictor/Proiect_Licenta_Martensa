package org.demo.cartservice.exception;

public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(Long userId) {
        super("Cart not found for user with ID: " + userId);
    }
}
