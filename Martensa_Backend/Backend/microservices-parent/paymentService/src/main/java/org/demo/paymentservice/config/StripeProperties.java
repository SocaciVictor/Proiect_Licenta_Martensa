package org.demo.paymentservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "stripe")
@Data
public class StripeProperties {
    private String secretKey;
    private List<String> webhookSecrets;
}
