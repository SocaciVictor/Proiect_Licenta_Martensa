package org.demo.orderservice.listeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.orderservice.dto.PaymentCompletedEvent;
import org.demo.orderservice.model.Order;
import org.demo.orderservice.model.enums.OrderStatus;
import org.demo.orderservice.model.enums.PaymentStatus;
import org.demo.orderservice.repository.OrderRepository;
import org.demo.orderservice.service.OrderService;
import org.demo.orderservice.feign.StoreClient;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderListener {

    private final OrderRepository orderRepository;
    private final StoreClient storeClient;

    @RabbitListener(queues = "${rabbit.payment-response.queue}")
    public void handlePaymentResult(PaymentCompletedEvent event) {
        log.info("⬅️ [x] Received PaymentCompletedEvent for orderId={}, status={}", event.orderId(), event.status());

        try {
            orderRepository.findByIdWithItems(event.orderId()).ifPresentOrElse(order -> {
                if (event.status() == PaymentStatus.SUCCESS) {
                    order.setOrderStatus(OrderStatus.COMPLETED);
                    orderRepository.save(order);

                    if (order.getStoreId() != null) {
                        order.getItems().forEach(item -> {
                            storeClient.decreaseStock(order.getStoreId(), item.getProductId(), item.getQuantity());
                        });
                        log.info("📉 Stock decreased for order {}", order.getId());
                    } else {
                        log.warn("⚠️ StoreId is null for order {}", order.getId());
                    }

                    log.info("✅ Order {} marked as COMPLETED", order.getId());
                } else {
                    orderRepository.delete(order);
                    log.info("🗑️ Order {} deleted due to FAILED payment", order.getId());
                }
            }, () -> {
                log.warn("❌ Order with ID {} not found in DB. Ignoring PaymentCompletedEvent.", event.orderId());
            });

        } catch (Exception e) {
            log.error("💥 Exception while processing PaymentCompletedEvent: {}", e.getMessage(), e);
        }
    }
}
