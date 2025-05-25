package org.demo.orderservice.service.Impl;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.orderservice.config.OrderRabbitProperties;
import org.demo.orderservice.dto.*;
import org.demo.orderservice.dto.request.OrderRequest;
import org.demo.orderservice.dto.response.OrderResponse;
import org.demo.orderservice.exception.OrderNotFoundException;
import org.demo.orderservice.feign.ProductClient;
import org.demo.orderservice.feign.UserClient;
import org.demo.orderservice.mapper.OrderMapper;
import org.demo.orderservice.model.Order;
import org.demo.orderservice.model.OrderItem;
import org.demo.orderservice.model.enums.OrderStatus;
import org.demo.orderservice.repository.OrderRepository;
import org.demo.orderservice.service.OrderService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final UserClient userClient;
    private final RabbitTemplate rabbitTemplate;
    private final OrderRabbitProperties rabbitProps;
    private final OrderMapper orderMapper;

    @Override
    public OrderResponse placeOrder(OrderRequest request, String email) {
        UserSummaryDto user = userClient.getUserByEmail(email);
        List<ProductDTO> products = request.productIds().stream()
                .map(productClient::getProductById)
                .toList();

        BigDecimal total = products.stream()
                .map(ProductDTO::price)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderItem> items = products.stream()
                .map(p -> OrderItem.builder()
                        .productId(p.id())
                        .productName(p.name())
                        .price(p.price())
                        .quantity(1)
                        .build())
                .toList();


        Order order = orderMapper.toEntity(request, user.id(), items, total);
        items.forEach(item -> item.setOrder(order));
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        OrderCreatedEvent event = new OrderCreatedEvent(
                saved.getId(),
                saved.getUserId(),
                saved.getTotalAmount(),
                request.productIds(),
                saved.getPaymentMethod()
        );

        rabbitTemplate.convertAndSend(
                rabbitProps.getOrder().getExchange(),
                rabbitProps.getOrder().getRoutingKey(),
                event
        );

        return orderMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
        return orderMapper.toResponse(order);
    }

    @Override
    public void markOrderAsCompleted(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        order.setOrderStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);

        log.info("✅ Order {} marked as COMPLETED", order.getId());
    }

    @Override
    public OrderResponse deleteOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        orderRepository.delete(order);

        log.info("🗑️ Order {} deleted due to failed payment or admin action", order.getId());
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponse)
                .toList();
    }

}
