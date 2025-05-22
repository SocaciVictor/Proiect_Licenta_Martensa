package org.demo.apigateway.config;

import org.demo.apigateway.util.AuthClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;

import io.jsonwebtoken.Claims;
import org.demo.apigateway.util.JwtUtil;
import org.demo.apigateway.util.RouterValidator;

import java.util.List;

@Component
public class AuthenticationGatewayFilterFactory extends AbstractGatewayFilterFactory<AuthenticationGatewayFilterFactory.Config> {

    @Autowired
    private  RouterValidator routerValidator;
    @Autowired
    private  JwtUtil jwtUtil;
    @Autowired
    private AuthClient authClient;

    public AuthenticationGatewayFilterFactory() {
        super(Config.class);
    }

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

                            // Verificare rol doar pentru metode sensibile
                            String method = request.getMethod() != null ? request.getMethod().name() : "";
                            if (List.of("POST", "PUT", "DELETE").contains(method)) {
                                if (roles == null || !roles.contains("ROLE_ADMIN")) {
                                    return onError(finalExchange, "Acces interzis – rolul ADMIN este necesar", HttpStatus.FORBIDDEN);
                                }
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



    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }

    public static class Config {

    }
}
