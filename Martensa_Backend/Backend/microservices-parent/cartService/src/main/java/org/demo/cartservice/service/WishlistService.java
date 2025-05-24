package org.demo.cartservice.service;

import org.demo.cartservice.dto.request.AddProductRequest;
import org.demo.cartservice.dto.request.RemoveProductRequest;
import org.demo.cartservice.dto.response.WishlistResponse;

public interface WishlistService {
    WishlistResponse getWishlistForUser(String email);
    void addProduct(String email, AddProductRequest request);
    void removeProduct(String email, RemoveProductRequest request);
    void clearWishlist(String email);
}
