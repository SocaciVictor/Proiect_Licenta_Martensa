package org.demo.apigateway.config;

import io.jsonwebtoken.Claims;
import org.demo.apigateway.util.AuthClient;
import org.demo.apigateway.util.JwtUtil;
import org.demo.apigateway.util.RouterValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.*;

@Component
public class AuthenticationGatewayFilterFactory extends AbstractGatewayFilterFactory<AuthenticationGatewayFilterFactory.Config> {

    @Autowired
    private RouterValidator routerValidator;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthClient authClient;

    public AuthenticationGatewayFilterFactory() {
        super(Config.class);
    }

    private static final Map<String, List<String>> protectedRoutesByRole = Map.of(
            "ROLE_ADMIN", List.of(
                    "GET:/users",
                    "GET:/users/",
                    "POST:/products",
                    "PUT:/products",
                    "DELETE:/products"
            )

    );

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            if (routerValidator.isSecured.test(request)) {
                if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    return onError(exchange, "Lipsă antet Authorization", HttpStatus.UNAUTHORIZED);
                }

                String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    return onError(exchange, "Format antet Authorization invalid", HttpStatus.UNAUTHORIZED);
                }

                String token = authHeader.substring(7);
                ServerWebExchange finalExchange = exchange;

                return authClient.validateToken(token)
                        .flatMap(isValid -> {
                            if (!isValid) {
                                return onError(finalExchange, "Token JWT invalid sau expirat", HttpStatus.UNAUTHORIZED);
                            }

                            Claims claims = jwtUtil.extractAllClaims(token);
                            List<String> roles = (List<String>) claims.get("roles");

                            String path = request.getPath().value(); // ex: /users/1
                            String method = request.getMethod() != null ? request.getMethod().name() : "";
                            String baseRoute = method + ":" + extractBasePath(path); // ex: GET:/users

                            boolean isDenied = protectedRoutesByRole.entrySet().stream()
                                    .anyMatch(entry -> baseRouteMatches(baseRoute, entry.getValue()) &&
                                            (roles == null || !roles.contains(entry.getKey())));

                            if (isDenied) {
                                return onError(finalExchange, "Acces interzis – rolul necesar lipsește", HttpStatus.FORBIDDEN);
                            }

                            ServerHttpRequest mutatedRequest = finalExchange.getRequest().mutate()
                                    .header("email", claims.getSubject())
                                    .header("roles", String.join(",", roles))
                                    .build();

                            ServerWebExchange mutatedExchange = finalExchange.mutate().request(mutatedRequest).build();
                            return chain.filter(mutatedExchange);
                        });
            }

            return chain.filter(exchange);
        };
    }

    private String extractBasePath(String fullPath) {
        String[] parts = fullPath.split("/");
        return parts.length > 1 ? "/" + parts[1] : fullPath;
    }

    private boolean baseRouteMatches(String route, List<String> protectedRoutes) {
        return protectedRoutes.stream().anyMatch(route::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        return exchange.getResponse().setComplete();
    }

    public static class Config {}
}
