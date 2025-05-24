package org.demo.cartservice.dto.response;

import java.util.List;

public record WishlistResponse(
        Long wishlistId,
        Long userId,
        List<ProductDetailsResponse> products
) {
}
