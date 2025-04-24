package com.martensa.userService.model;


import java.util.UUID;

public class LoyaltyCardNumberGenerator {
    public static String generateCardNumber(){
        return UUID.randomUUID().toString();
    }
}
