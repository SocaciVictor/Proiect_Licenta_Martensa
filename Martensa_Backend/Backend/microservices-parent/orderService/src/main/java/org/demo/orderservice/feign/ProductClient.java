package org.demo.orderservice.feign;

import org.demo.orderservice.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "productservice")
public interface ProductClient {
    @GetMapping("/products/{id}")
    ProductDTO getProductById(@PathVariable Long id);
}
