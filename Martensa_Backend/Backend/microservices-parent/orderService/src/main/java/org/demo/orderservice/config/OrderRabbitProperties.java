package org.demo.orderservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "order")
public class OrderRabbitProperties {
    private String queue;
    private String exchange;
    private String routingKey;
}

