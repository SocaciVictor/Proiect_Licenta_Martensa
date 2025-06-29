package org.demo.orderservice.service;

import org.demo.orderservice.dto.request.OrderRequest;
import org.demo.orderservice.dto.response.OrderResponse;
import org.demo.orderservice.model.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request, String email);
    OrderResponse getOrderById(Long id);
    OrderResponse deleteOrderById(Long id);
    List<OrderResponse> getAllOrders();
    void markOrderAsCompleted(Long aLong);
    List<OrderResponse> getOrdersByUserId(Long userId);

    OrderStatus getOrderStatus(Long id);
}
