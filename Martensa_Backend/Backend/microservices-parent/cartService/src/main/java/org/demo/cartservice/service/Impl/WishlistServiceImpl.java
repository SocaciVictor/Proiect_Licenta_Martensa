package org.demo.cartservice.service.Impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.demo.cartservice.dto.UserDto;
import org.demo.cartservice.dto.request.AddProductRequest;
import org.demo.cartservice.dto.request.RemoveProductRequest;
import org.demo.cartservice.dto.response.ProductDetailsResponse;
import org.demo.cartservice.dto.response.WishlistResponse;
import org.demo.cartservice.exception.ProductAlreadyInCartException;
import org.demo.cartservice.exception.ProductNotFoundException;
import org.demo.cartservice.feign.ProductClient;
import org.demo.cartservice.feign.UserClient;
import org.demo.cartservice.model.Wishlist;
import org.demo.cartservice.repository.WishlistRepository;
import org.demo.cartservice.service.WishlistService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserClient userClient;
    private final ProductClient productClient;

    @Override
    @Transactional
    public WishlistResponse getWishlistForUser(String email) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Wishlist wishlist = wishlistRepository.findByUserID(userId)
                .orElseGet(() -> wishlistRepository.save(
                        Wishlist.builder()
                                .userID(userId)
                                .productsID(new ArrayList<>())
                                .build()
                ));

        List<ProductDetailsResponse> products = wishlist.getProductsID().stream()
                .map(id -> {
                    try {
                        return productClient.getProductById(id);
                    } catch (Exception e) {
                        throw new ProductNotFoundException(id);
                    }
                })
                .collect(Collectors.toList());

        return new WishlistResponse(wishlist.getId(), userId, products);
    }

    @Override
    @Transactional
    public void addProduct(String email, AddProductRequest request) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Wishlist wishlist = wishlistRepository.findByUserID(userId)
                .orElseGet(() -> Wishlist.builder()
                        .userID(userId)
                        .productsID(new ArrayList<>())
                        .build());

        if (wishlist.getProductsID().contains(request.productId())) {
            throw new ProductAlreadyInCartException(request.productId());
        }

        try {
            productClient.getProductById(request.productId());
        } catch (Exception e) {
            throw new ProductNotFoundException(request.productId());
        }

        wishlist.getProductsID().add(request.productId());
        wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void removeProduct(String email, RemoveProductRequest request) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Wishlist wishlist = wishlistRepository.findByUserID(userId)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        if (!wishlist.getProductsID().remove(request.productId())) {
            throw new ProductAlreadyInCartException(request.productId());
        }

        wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void clearWishlist(String email) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Wishlist wishlist = wishlistRepository.findByUserID(userId)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        wishlist.getProductsID().clear();
        wishlistRepository.save(wishlist);
    }
}
