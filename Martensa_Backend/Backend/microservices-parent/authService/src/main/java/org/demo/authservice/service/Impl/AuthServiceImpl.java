package org.demo.authservice.service.Impl;

import lombok.RequiredArgsConstructor;
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
    public String register(RegisterRequest registerRequest) {
        String encryptedPassword = passwordEncoder.encode(registerRequest.password());
        UserDto userDto = userMapper.toUserDto(registerRequest, encryptedPassword);
        userClient.createUser(userDto);

        List<String> roles = List.of("ROLE_CUSTOMER");

        return jwtService.generateToken(registerRequest.email(), roles);
    }

    @Override
    public String login(LoginRequest request) {
        UserDto userDto = userClient.getUserByEmail(request.email());
        if (userDto == null) {
            throw new UsernameNotFoundException("User not found");
        }

        boolean passwordMatches = passwordEncoder.matches(request.password(), userDto.encryptedPassword());
        if (!passwordMatches) {
            throw new BadCredentialsException("Invalid password");
        }

        return jwtService.generateToken(userDto.email(), userDto.roles());
    }

    @Override
    public boolean validateToken(String token) {
        return jwtService.isTokenValid(token);
    }

}
