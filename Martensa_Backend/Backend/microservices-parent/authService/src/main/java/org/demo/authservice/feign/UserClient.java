package org.demo.authservice.feign;

import jakarta.validation.Valid;
import org.demo.authservice.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "userService", url = "http://localhost:8086")
public interface UserClient {
    @PostMapping("/users")
    void createUser(@RequestBody @Valid UserDto userDto);

    @GetMapping("/users/email/{email}")
    UserDto getUserByEmail(@PathVariable String email);
}
