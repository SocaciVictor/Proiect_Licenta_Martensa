package com.martensa.userService.exception;

public class InsufficientLoyaltyPointsException extends RuntimeException {
    public InsufficientLoyaltyPointsException(String message) {
        super(message);
    }
}
