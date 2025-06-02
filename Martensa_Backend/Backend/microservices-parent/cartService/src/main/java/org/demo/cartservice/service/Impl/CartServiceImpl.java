
package org.demo.cartservice.service.Impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.demo.cartservice.dto.ProductDto;
import org.demo.cartservice.dto.UserDto;
import org.demo.cartservice.dto.request.AddProductRequest;
import org.demo.cartservice.dto.request.RemoveProductRequest;
import org.demo.cartservice.dto.response.CartResponse;
import org.demo.cartservice.dto.response.ProductDetailsResponse;
import org.demo.cartservice.dto.response.ProductDetailsWithQuantity;
import org.demo.cartservice.exception.CartNotFoundException;
import org.demo.cartservice.exception.ProductNotFoundException;
import org.demo.cartservice.exception.ProductNotInCartException;
import org.demo.cartservice.feign.ProductClient;
import org.demo.cartservice.feign.UserClient;
import org.demo.cartservice.model.Cart;
import org.demo.cartservice.repository.CartRepository;
import org.demo.cartservice.service.CartService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;
    private final UserClient userClient;

    @Override
    @Transactional
    public CartResponse getCartForUser(String email) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .userId(userId)
                            .productsID(new java.util.HashMap<>())
                            .build();
                    return cartRepository.save(newCart);
                });

        List<ProductDetailsWithQuantity> products = cart.getProductsID().entrySet().stream()
                .map(entry -> {
                    try {
                        ProductDetailsResponse product = productClient.getProductById(entry.getKey());
                        return new ProductDetailsWithQuantity(
                                product.id(),
                                product.name(),
                                product.description(),
                                product.brand(),
                                product.price(),
                                product.discountPrice(),
                                product.imageUrl(),
                                product.barcode(),
                                product.ingredients(),
                                product.nutritionalInfo(),
                                product.disclaimer(),
                                product.alcoholPercentage(),
                                entry.getValue()
                        );

                    } catch (Exception e) {
                        throw new ProductNotFoundException(entry.getKey());
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
                        .productsID(new java.util.HashMap<>())
                        .build());

        try {
            productClient.getProductById(request.productId());
        } catch (Exception e) {
            throw new ProductNotFoundException(request.productId());
        }

        cart.getProductsID().merge(request.productId(), 1, Integer::sum);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void removeProduct(String email, RemoveProductRequest request) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException(userId));

        Map<Long, Integer> products = cart.getProductsID();
        if (!products.containsKey(request.productId())) {
            throw new ProductNotInCartException(request.productId());
        }

        int quantity = products.get(request.productId());
        if (quantity > 1) {
            products.put(request.productId(), quantity - 1);
        } else {
            products.remove(request.productId());
        }

        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(String email) {
        UserDto user = userClient.getUserByEmail(email);
        Long userId = user.id();

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException(userId));

        cart.getProductsID().clear();
        cartRepository.save(cart);
    }
}
