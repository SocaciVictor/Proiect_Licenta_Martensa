package com.martensa.userService.service;


import com.martensa.userService.dto.request.UserDto;
import com.martensa.userService.dto.request.UserRequest;
import com.martensa.userService.model.User;
import jakarta.validation.Valid;

import java.util.Optional;

public interface UserService {
    void createUser(@Valid UserDto userDTO);

    UserDto getUserByEmail(String email);
}
