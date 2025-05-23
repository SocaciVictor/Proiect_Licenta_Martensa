package org.demo.cartservice.service.Impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.demo.cartservice.dto.ProductDto;
import org.demo.cartservice.dto.UserDto;
import org.demo.cartservice.dto.request.AddProductRequest;
import org.demo.cartservice.dto.request.RemoveProductRequest;
import org.demo.cartservice.dto.response.CartResponse;
import org.demo.cartservice.exception.CartNotFoundException;
import org.demo.cartservice.exception.ProductAlreadyInCartException;
import org.demo.cartservice.exception.ProductNotFoundException;
import org.demo.cartservice.exception.ProductNotInCartException;
import org.demo.cartservice.feign.ProductClient;
import org.demo.cartservice.feign.UserClient;
import org.demo.cartservice.model.Cart;
import org.demo.cartservice.repository.CartRepository;
import org.demo.cartservice.service.CartService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;
    private final UserClient userClient;

    @Override
    public CartResponse getCartForUser(String email) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .userId(userId)
                            .productsID(new java.util.ArrayList<>())
                            .build();
                    return cartRepository.save(newCart);
                });


        List<ProductDto> products = cart.getProductsID().stream()
                .map(id -> {
                    try {
                        return productClient.getProductById(id);
                    } catch (Exception e) {
                        throw new ProductNotFoundException(id);
                    }
                })
                .collect(Collectors.toList());

        return new CartResponse(cart.getId(), userId, products, products.isEmpty());
    }

    @Override
    @Transactional
    public void addProduct(String email, AddProductRequest request) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> Cart.builder()
                        .userId(userId)
                        .productsID(new java.util.ArrayList<>())
                        .build());

        if (cart.getProductsID().contains(request.productId())) {
            throw new ProductAlreadyInCartException(request.productId());
        }

        try {
            productClient.getProductById(request.productId());
        } catch (Exception e) {
            throw new ProductNotFoundException(request.productId());
        }

        cart.getProductsID().add(request.productId());
        cartRepository.save(cart);
    }

    @Override
    public void removeProduct(String email, RemoveProductRequest request) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException(userId));

        if (!cart.getProductsID().remove(request.productId())) {
            throw new ProductNotInCartException(request.productId());
        }

        cartRepository.save(cart);
    }

    @Override
    public void clearCart(String email) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException(userId));

        cart.getProductsID().clear();
        cartRepository.save(cart);
    }

}
