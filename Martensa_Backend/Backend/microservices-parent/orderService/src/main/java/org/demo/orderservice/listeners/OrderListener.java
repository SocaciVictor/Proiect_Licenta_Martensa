package org.demo.orderservice.listeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.orderservice.dto.PaymentCompletedEvent;
import org.demo.orderservice.dto.ProductQuantity;
import org.demo.orderservice.model.Order;
import org.demo.orderservice.model.enums.OrderStatus;
import org.demo.orderservice.model.enums.PaymentStatus;
import org.demo.orderservice.repository.OrderRepository;
import org.demo.orderservice.feign.StoreClient;
import org.demo.orderservice.service.Impl.LoyaltyPointsPublisher;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderListener {

    private final OrderRepository orderRepository;
    private final StoreClient storeClient;
    private final LoyaltyPointsPublisher loyaltyPointsPublisher;

    @RabbitListener(queues = "${rabbit.payment-response.queue}")
    public void handlePaymentResult(PaymentCompletedEvent event) {
        log.info("⬅️ [x] Received PaymentCompletedEvent for orderId={}, status={}, products={}",
                event.orderId(), event.status(), event.products());

        try {
            orderRepository.findByIdWithItems(event.orderId()).ifPresentOrElse(order -> {
                if (event.status() == PaymentStatus.SUCCESS) {
                    order.setOrderStatus(OrderStatus.COMPLETED);
                    orderRepository.save(order);

                    if (order.getStoreId() != null && event.products() != null) {
                        for (ProductQuantity pq : event.products()) {
                            if (pq.quantity() > 0) {
                                storeClient.decreaseStock(order.getStoreId(), pq.productId(), pq.quantity());
                                log.info("📉 Decreased stock for productId={} with quantity={} in storeId={}",
                                        pq.productId(), pq.quantity(), order.getStoreId());
                            }
                        }
                    } else {
                        log.warn("⚠️ StoreId={}, ProductQuantities={} pentru order {}",
                                order.getStoreId(),
                                event.products(),
                                order.getId());
                    }

                    loyaltyPointsPublisher.sendLoyaltyPointsEvent(order.getUserId(), order.getTotalAmount());
                    log.info("🏅 LoyaltyPointsEvent sent for userId={} amount={}", order.getUserId(), order.getTotalAmount());

                    log.info("✅ Order {} marked as COMPLETED", order.getId());
                } else {
                    order.setOrderStatus(OrderStatus.FAILED);
                    orderRepository.save(order);
                    log.info("❌ Order {} marked as FAILED", order.getId());
                }
            }, () -> {
                log.warn("❌ Order with ID {} not found in DB. Ignoring PaymentCompletedEvent.", event.orderId());
            });

        } catch (Exception e) {
            log.error("💥 Exception while processing PaymentCompletedEvent: {}", e.getMessage(), e);
        }
    }
}

