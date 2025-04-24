package org.demo.authservice.controller;

import io.micrometer.observation.annotation.Observed;
import jakarta.validation.Valid;
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
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        String token = authService.register(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/token")
    public ResponseEntity<String> getToken(@Valid @RequestBody UserTokenDto request) {
        String token = authService.getToken(request.email());
        return ResponseEntity.ok(token);
    }


    @PostMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        boolean isValid = authService.validateToken(token);

        if (isValid) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }



}
