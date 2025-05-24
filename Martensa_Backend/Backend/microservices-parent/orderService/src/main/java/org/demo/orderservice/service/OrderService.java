package org.demo.orderservice.service;

import org.demo.orderservice.dto.request.OrderRequest;
import org.demo.orderservice.dto.response.OrderResponse;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request, String email);
}
