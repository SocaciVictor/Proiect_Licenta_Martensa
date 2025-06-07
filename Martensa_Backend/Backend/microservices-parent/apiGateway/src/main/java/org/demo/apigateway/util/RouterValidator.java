package org.demo.apigateway.util;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {

    private static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/login",
            "/auth/validate",
            "/auth/token",
            "/products/category",
            "/products",
            "/categories",
            "/promotions/product",
            "/payments/**"
    );


    public Predicate<ServerHttpRequest> isSecured = request ->
            openApiEndpoints.stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}


