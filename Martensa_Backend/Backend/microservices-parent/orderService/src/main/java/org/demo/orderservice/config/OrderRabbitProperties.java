package org.demo.orderservice.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rabbit")
@Getter
@Setter
public class OrderRabbitProperties {
    private ExchangeConfig order;
    private ExchangeConfig paymentResponse;
    private LoyaltyPointsConfig loyaltyPoints;

    @Data
    public static class ExchangeConfig {
        private String exchange;
        private String routingKey;
        private String queue;
    }
    @Data
    public static class LoyaltyPointsConfig {
        private String exchange;
        private String routingKey;
        private String queue;
    }

}


