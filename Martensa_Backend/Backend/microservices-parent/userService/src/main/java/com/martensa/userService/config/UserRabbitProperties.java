package com.martensa.userService.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "rabbit")
public class UserRabbitProperties {
    private LoyaltyPointsConfig loyaltyPoints;

    @Data
    public static class LoyaltyPointsConfig {
        private String exchange;
        private String routingKey;
        private String queue;
    }
}