package org.demo.cartservice.feign;

import org.demo.cartservice.dto.response.ProductDetailsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "productservice", url = "http://localhost:8081")
public interface ProductClient {

    @GetMapping("/products/{id}")
    ProductDetailsResponse getProductById(@PathVariable Long id);
}
