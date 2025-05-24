package org.demo.orderservice.service.Impl;

import lombok.RequiredArgsConstructor;
import org.demo.orderservice.dto.request.OrderRequest;
import org.demo.orderservice.dto.response.OrderResponse;
import org.demo.orderservice.config.OrderRabbitProperties;
import org.demo.orderservice.dto.*;
import org.demo.orderservice.feign.ProductClient;
import org.demo.orderservice.feign.UserClient;
import org.demo.orderservice.mapper.OrderMapper;
import org.demo.orderservice.model.Order;
import org.demo.orderservice.repository.OrderRepository;
import org.demo.orderservice.service.OrderService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
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

        Order order = orderMapper.toEntity(request, user.id(), products, total);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        OrderCreatedEvent event = new OrderCreatedEvent(
                saved.getId(),
                saved.getUserId(),
                saved.getTotalAmount(),
                request.productIds(),
                saved.getPaymentMethod()
        );

        rabbitTemplate.convertAndSend(rabbitProps.getExchange(), rabbitProps.getRoutingKey(), event);

        return orderMapper.toResponse(saved);
    }
}
