package org.demo.orderservice.listeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.orderservice.config.OrderRabbitProperties;
import org.demo.orderservice.dto.PaymentCompletedEvent;
import org.demo.orderservice.model.enums.OrderStatus;
import org.demo.orderservice.model.enums.PaymentStatus;
import org.demo.orderservice.repository.OrderRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderListener {

    private final OrderRepository orderRepository;
    private final OrderRabbitProperties rabbitProps;

    @RabbitListener(queues = "${rabbit.payment-response.queue}")
    public void handlePaymentResult(PaymentCompletedEvent event) {
        log.info("⬅️ [x] Received PaymentCompletedEvent for orderId={}, status={}", event.orderId(), event.status());

        orderRepository.findById(event.orderId()).ifPresentOrElse(order -> {
            if (event.status() == PaymentStatus.SUCCESS) {
                order.setOrderStatus(OrderStatus.COMPLETED);
                orderRepository.save(order);
                log.info("✅ Order {} set to COMPLETED", order.getId());
            } else {
                orderRepository.deleteById(order.getId());
                log.info("❌ Order {} deleted due to failed payment", order.getId());
            }
        }, () -> log.warn("⚠️ Order with id {} not found", event.orderId()));
    }
}
