package org.demo.cartservice.dto.response;

import org.demo.cartservice.dto.ProductDto;

import java.util.List;

public record CartResponse(
        Long cartId,
        Long userId,
        List<ProductDetailsResponse> products,
        boolean isEmpty
) {
}
