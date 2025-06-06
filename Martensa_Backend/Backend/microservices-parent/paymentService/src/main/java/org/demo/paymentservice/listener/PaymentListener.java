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

    private final PaymentService paymentService;
    private final RabbitTemplate rabbitTemplate;
    private final PaymentRabbitProperties rabbitProps;

    @RabbitListener(queues = "${rabbit.payment.queue}")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("⬅️ [x] Received OrderCreatedEvent for orderId={}", event.orderId());

        boolean paymentOk = simulatePaymentProcessing();

        // Mapăm produsele din OrderCreatedEvent în ProductQuantity:
        List<ProductQuantity> productQuantities = event.products().stream()
                .map(p -> new ProductQuantity(p.productId(), p.quantity()))
                .toList();

        if (paymentOk) {
            Payment payment = Payment.builder()
                    .orderId(event.orderId())
                    .userId(event.userId())
                    .amount(event.totalAmount())
                    .method(event.paymentMethod())
                    .paymentDate(LocalDate.now())
                    .status(PaymentStatus.SUCCESS)
                    .build();

            paymentService.save(payment);

            rabbitTemplate.convertAndSend(
                    rabbitProps.getOrderResponse().getExchange(),
                    rabbitProps.getOrderResponse().getRoutingKey(),
                    new PaymentCompletedEvent(
                            event.orderId(),
                            event.userId(),
                            event.totalAmount(),
                            PaymentStatus.SUCCESS,
                            productQuantities
                    )
            );

            log.info("✅ Emitted PaymentCompletedEvent for orderId={}", event.orderId());
        } else {
            rabbitTemplate.convertAndSend(
                    rabbitProps.getOrderResponse().getExchange(),
                    rabbitProps.getOrderResponse().getRoutingKey(),
                    new PaymentCompletedEvent(
                            event.orderId(),
                            event.userId(),
                            event.totalAmount(),
                            PaymentStatus.FAILED,
                            productQuantities
                    )
            );

            log.info("❌ Emitted FAILED PaymentCompletedEvent for orderId={}", event.orderId());
        }
    }

    private boolean simulatePaymentProcessing() {
        return true; // sau false pentru testare
    }
}
