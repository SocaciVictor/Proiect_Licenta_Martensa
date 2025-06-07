package org.demo.orderservice.dto.request;

import java.util.List;

public record OrderRequest(
        Long storeId,
        List<ProductOrderRequest> products,
        String shippingAddress,
        String paymentMethod
) {}
