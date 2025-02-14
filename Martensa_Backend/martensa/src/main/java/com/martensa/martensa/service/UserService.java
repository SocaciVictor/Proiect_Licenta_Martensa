package com.martensa.martensa.service;


import com.martensa.martensa.model.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);


    User register(User user);

    String verify(User user);
}
