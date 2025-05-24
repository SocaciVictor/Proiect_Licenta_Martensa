package org.demo.orderservice.dto.request;

import java.util.List;

public record OrderRequest(
        List<Long> productIds,
        String shippingAddress,
        String paymentMethod
) {
}
