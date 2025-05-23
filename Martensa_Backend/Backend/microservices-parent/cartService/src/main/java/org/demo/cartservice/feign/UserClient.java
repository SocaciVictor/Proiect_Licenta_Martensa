package org.demo.cartservice.feign;

import org.demo.cartservice.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "userservice", url = "http://localhost:8086")
public interface UserClient {

    @GetMapping("/users/email/{email}")
    UserDto getUserByEmail(@PathVariable String email);
}
