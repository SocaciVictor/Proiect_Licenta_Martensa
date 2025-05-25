package org.demo.paymentservice.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;


@ConfigurationProperties(prefix = "rabbit")
@Getter
@Setter
public class PaymentRabbitProperties {
    private ExchangeConfig payment;
    private ExchangeConfig orderResponse;

    @Data
    public static class ExchangeConfig {
        private String exchange;
        private String routingKey;
        private String queue;
    }
}
