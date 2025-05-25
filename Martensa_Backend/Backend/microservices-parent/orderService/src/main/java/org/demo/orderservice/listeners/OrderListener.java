package org.demo.orderservice.listeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.orderservice.dto.PaymentCompletedEvent;
import org.demo.orderservice.model.enums.PaymentStatus;
import org.demo.orderservice.service.OrderService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderListener {

    private final OrderService orderService;

    @RabbitListener(queues = "${rabbit.payment-response.queue}")
    public void handlePaymentResult(PaymentCompletedEvent event) {
        log.info("⬅️ [x] Received PaymentCompletedEvent for orderId={}, status={}", event.orderId(), event.status());

        if (event.status() == PaymentStatus.SUCCESS) {
            orderService.markOrderAsCompleted(event.orderId());
        } else {
            orderService.deleteOrderById(event.orderId());
        }
    }
}
