package org.demo.productservice.feign;

import org.demo.productservice.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "userService", url="http://localhost:8086")
public interface UserClient {

    @GetMapping("/users/{id}")
    UserDto getUserById(@PathVariable Long id);

    @PostMapping("/users/{id}/loyalty-card/deduct-points")
    void deductLoyaltyPoints(@PathVariable("id") Long userId, @RequestParam("points") int points);
}
