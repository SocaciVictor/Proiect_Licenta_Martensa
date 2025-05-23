package com.martensa.userService.controller;

import com.martensa.userService.dto.request.UserDto;
import com.martensa.userService.dto.request.UserRequest;
import com.martensa.userService.dto.request.UserUpdateRequest;
import com.martensa.userService.dto.response.LoyaltyCardResponse;
import com.martensa.userService.dto.response.UserProfileResponse;
import com.martensa.userService.dto.response.UserSummaryResponse;
import io.micrometer.observation.annotation.Observed;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.martensa.userService.service.UserService;

import java.util.List;


@RestController
@CrossOrigin
@RequestMapping(path = "/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Observed(name = "user.create")
    @PostMapping
    public ResponseEntity<Void> createUser(@RequestBody @Valid UserDto userDto) {
        userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        UserDto user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(@RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(userService.getProfileByEmail(email));
    }

    @GetMapping("/loyalty-card")
    public ResponseEntity<LoyaltyCardResponse> getLoyaltyCard(@RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(userService.getLoyaltyCard(email));
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateUser(
            @RequestHeader("X-User-Email") String email,
            @RequestBody @Valid UserUpdateRequest request) {
        userService.updateUser(email, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser(@RequestHeader("X-User-Email") String email) {
        userService.deleteUser(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }


}
