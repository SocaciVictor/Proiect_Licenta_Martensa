package org.demo.cartservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.demo.cartservice.dto.request.AddProductRequest;
import org.demo.cartservice.dto.request.RemoveProductRequest;
import org.demo.cartservice.dto.response.WishlistResponse;
import org.demo.cartservice.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/me")
    public ResponseEntity<WishlistResponse> getWishlist(@RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(wishlistService.getWishlistForUser(email));
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addProductToWishlist(
            @RequestHeader("X-User-Email") String email,
            @RequestBody @Valid AddProductRequest request) {
        wishlistService.addProduct(email, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeProductFromWishlist(
            @RequestHeader("X-User-Email") String email,
            @RequestBody @Valid RemoveProductRequest request) {
        wishlistService.removeProduct(email, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishlist(@RequestHeader("X-User-Email") String email) {
        wishlistService.clearWishlist(email);
        return ResponseEntity.noContent().build();
    }
}
