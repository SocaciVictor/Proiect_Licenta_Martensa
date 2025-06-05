package org.demo.orderservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "store-service")
public interface StoreClient {

    @PutMapping("/stores/{storeId}/stock/{productId}/decrease")
    void decreaseStock(@PathVariable Long storeId, @PathVariable Long productId, @RequestParam int quantity);
}
