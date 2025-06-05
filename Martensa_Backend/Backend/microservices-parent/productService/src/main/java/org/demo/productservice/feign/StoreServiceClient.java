package org.demo.productservice.feign;

import org.demo.productservice.dto.StoreProductStockResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "store-service")
public interface StoreServiceClient {

    @GetMapping("/stores/{storeId}/stock/{productId}")
    StoreProductStockResponse getStockForProduct(@PathVariable Long storeId, @PathVariable Long productId);
}
