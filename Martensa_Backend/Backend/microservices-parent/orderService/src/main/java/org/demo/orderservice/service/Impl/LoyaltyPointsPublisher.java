package org.demo.orderservice.service.Impl;

import lombok.RequiredArgsConstructor;
import org.demo.orderservice.config.OrderRabbitProperties;
import org.demo.orderservice.dto.LoyaltyPointsEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class LoyaltyPointsPublisher {

    private final RabbitTemplate rabbitTemplate;
    private final OrderRabbitProperties properties;

    public void sendLoyaltyPointsEvent(Long userId, BigDecimal amountPaid) {
        LoyaltyPointsEvent event = new LoyaltyPointsEvent(userId, amountPaid);

        rabbitTemplate.convertAndSend(
                properties.getLoyaltyPoints().getExchange(),
                properties.getLoyaltyPoints().getRoutingKey(),
                event
        );
    }
}