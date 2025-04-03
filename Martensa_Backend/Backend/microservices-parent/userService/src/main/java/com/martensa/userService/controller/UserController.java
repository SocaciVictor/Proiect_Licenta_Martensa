package com.martensa.userService.controller;

import com.martensa.userService.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.martensa.userService.service.UserService;



@RestController
@CrossOrigin
@RequestMapping(path = "/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/hello")
    public String getHello() {
        return "Hello";
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @GetMapping("/login")
    public String login(@RequestBody User user) {
        return userService.verify(user);
    }
}
