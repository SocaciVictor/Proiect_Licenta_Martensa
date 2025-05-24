package org.demo.orderservice.feign;


import org.demo.orderservice.dto.UserSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserClient {
    @GetMapping("/users/email/{email}")
    UserSummaryDto getUserByEmail(@PathVariable String email);
}
