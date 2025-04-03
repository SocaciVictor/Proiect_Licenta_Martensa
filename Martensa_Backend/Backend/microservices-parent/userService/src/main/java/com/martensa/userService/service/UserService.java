package com.martensa.userService.service;


import com.martensa.userService.model.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);


    User register(User user);

    String verify(User user);
}
