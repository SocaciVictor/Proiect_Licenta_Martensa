package org.demo.paymentservice.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.paymentservice.config.PaymentRabbitProperties;
import org.demo.paymentservice.dto.OrderCreatedEvent;
import org.demo.paymentservice.dto.PaymentCompletedEvent;
import org.demo.paymentservice.dto.ProductQuantity;
import org.demo.paymentservice.model.Payment;
import org.demo.paymentservice.model.enums.PaymentStatus;
import org.demo.paymentservice.service.PaymentService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentListener {

    private final RabbitTemplate rabbitTemplate;
    private final PaymentRabbitProperties rabbitProps;

    @RabbitListener(queues = "${rabbit.payment.queue}")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("⬅️ [x] Received OrderCreatedEvent for orderId={}", event.orderId());

        if (event.products() != null) {
            event.products().forEach(pq ->
                    log.info("➡️ ProductId={} quantity={}", pq.productId(), pq.quantity())
            );
        }

        log.info("✅ Waiting for Stripe Webhook to confirm payment...");

    }
}

