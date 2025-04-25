package org.demo.authservice.controller;

import jakarta.validation.Valid;
import org.demo.authservice.dto.AuthResponse;
import org.demo.authservice.dto.LoginRequest;
import org.demo.authservice.dto.RegisterRequest;
import org.demo.authservice.dto.UserTokenDto;
import org.demo.authservice.service.AuthService;
import org.demo.authservice.service.Impl.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController(value = "/auth")
@CrossOrigin
@RequestMapping(path = "/auth")
public class AuthController {


    private final AuthService authService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse token = authService.register(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/token")
    public ResponseEntity<AuthResponse> getToken(@Valid @RequestBody UserTokenDto request) {
        AuthResponse token = authService.getToken(request.email());
        return ResponseEntity.ok(token);
    }


    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        boolean isValid = authService.validateToken(token);

        if (isValid) {
            return ResponseEntity.ok(Boolean.TRUE);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Boolean.FALSE);
        }
    }



}
