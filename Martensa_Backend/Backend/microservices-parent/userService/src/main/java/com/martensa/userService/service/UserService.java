package com.martensa.userService.service;


import com.martensa.userService.dto.request.UserDto;
import com.martensa.userService.dto.request.UserRequest;
import com.martensa.userService.dto.request.UserUpdateRequest;
import com.martensa.userService.dto.response.LoyaltyCardResponse;
import com.martensa.userService.dto.response.UserProfileResponse;
import com.martensa.userService.dto.response.UserSummaryResponse;
import com.martensa.userService.model.User;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void createUser(@Valid UserDto userDTO);

    UserDto getUserByEmail(String email);

    UserProfileResponse getProfileByEmail(String email);

    LoyaltyCardResponse getLoyaltyCard(String email);

    void updateUser(String email, UserUpdateRequest request);

    void deleteUser(String email);

    List<UserSummaryResponse> getAllUsers();

    UserProfileResponse getUserById(Long id);

    void deductLoyaltyPoints(Long id, int points);
}
