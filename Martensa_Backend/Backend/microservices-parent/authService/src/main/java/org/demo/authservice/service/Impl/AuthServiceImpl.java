package org.demo.authservice.service.Impl;

import lombok.RequiredArgsConstructor;
import org.demo.authservice.dto.AuthResponse;
import org.demo.authservice.dto.LoginRequest;
import org.demo.authservice.dto.RegisterRequest;
import org.demo.authservice.dto.UserDto;
import org.demo.authservice.feign.UserClient;
import org.demo.authservice.mapper.UserMapper;
import org.demo.authservice.service.AuthService;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserClient userClient;
    private final UserMapper userMapper;


    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        String encryptedPassword = passwordEncoder.encode(registerRequest.password());
        UserDto userDto = userMapper.toUserDto(registerRequest, encryptedPassword);
        userClient.createUser(userDto);

        List<String> roles = List.of("ROLE_CUSTOMER");
        String accessToken = jwtService.generateToken(registerRequest.email(), roles, "ACCESS");
        String refreshToken = jwtService.generateToken(registerRequest.email(), roles, "REFRESH");

        return new AuthResponse(accessToken, refreshToken);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        UserDto userDto = userClient.getUserByEmail(request.email());
        if (userDto == null) {
            throw new UsernameNotFoundException("User not found");
        }

        boolean passwordMatches = passwordEncoder.matches(request.password(), userDto.password());
        if (!passwordMatches) {
            throw new BadCredentialsException("Invalid password");
        }

        String accessToken = jwtService.generateToken(userDto.email(), userDto.roles(), "ACCESS");
        String refreshToken = jwtService.generateToken(userDto.email(), userDto.roles(), "REFRESH");

        return new AuthResponse(accessToken, refreshToken);
    }

    @Override
    public boolean validateToken(String token) {
        return jwtService.isTokenValid(token);
    }

    @Override
    public AuthResponse getToken(String email) {
        UserDto userDto = userClient.getUserByEmail(email);
        String accessToken = jwtService.generateToken(userDto.email(), userDto.roles(), "ACCESS");
        String refreshToken = jwtService.generateToken(userDto.email(), userDto.roles(), "REFRESH");
        return new AuthResponse(accessToken, refreshToken);
    }
}
