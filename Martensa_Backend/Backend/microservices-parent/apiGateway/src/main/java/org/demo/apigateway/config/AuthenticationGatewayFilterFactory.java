package org.demo.apigateway.config;

import io.jsonwebtoken.Claims;
import lombok.Getter;
import lombok.Setter;
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

import java.util.List;

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
                            String method = request.getMethod().name();

                            if (config.getSecuredMethods().contains(method)) {
                                boolean hasAccess = roles != null &&
                                        config.getRequiredRoles().stream().anyMatch(roles::contains);
                                if (!hasAccess) {
                                    return onError(finalExchange, "Acces interzis – rolul necesar lipsește", HttpStatus.FORBIDDEN);
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

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        return exchange.getResponse().setComplete();
    }

    @Setter
    @Getter
    public static class Config {
        private List<String> requiredRoles;
        private List<String> securedMethods;

    }
}
