package org.demo.cartservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.demo.cartservice.dto.request.AddProductRequest;
import org.demo.cartservice.dto.request.RemoveProductRequest;
import org.demo.cartservice.dto.response.CartResponse;
import org.demo.cartservice.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/me")
    public ResponseEntity<CartResponse> getCart(@RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(cartService.getCartForUser(email));
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addProduct(
            @RequestHeader("X-User-Email") String email,
            @RequestBody @Valid AddProductRequest request) {
        cartService.addProduct(email, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeProduct(
            @RequestHeader("X-User-Email") String email,
            @RequestBody @Valid RemoveProductRequest request) {
        cartService.removeProduct(email, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Email") String email) {
        cartService.clearCart(email);
        return ResponseEntity.noContent().build();
    }

}