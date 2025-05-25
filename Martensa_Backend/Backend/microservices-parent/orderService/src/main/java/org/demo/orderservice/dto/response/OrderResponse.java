package org.demo.orderservice.dto.response;

import org.demo.orderservice.dto.ProductDTO;
import org.demo.orderservice.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        LocalDate orderDate,
        BigDecimal totalAmount,
        OrderStatus orderStatus,
        String shippingAddress,
        String paymentMethod,
        String trackingNumber,
        List<ProductDTO> products
) {
}
