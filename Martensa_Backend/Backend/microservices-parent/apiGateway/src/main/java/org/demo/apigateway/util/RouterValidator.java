package org.demo.apigateway.util;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private static final List<String> openPublicEndpoints = List.of(
            "/auth/register",
            "/auth/login",
            "/auth/validate",
            "/auth/token",
            "/payments/**"
    );

    private static final List<String> openGetEndpoints = List.of(
            "/products/**",
            "/categories/**",
            "/promotions/**"
    );

    public Predicate<ServerHttpRequest> isSecured = request -> {
        String path = request.getURI().getPath();
        String method = request.getMethod().toString();

        boolean isPublic = openPublicEndpoints.stream()
                .anyMatch(uri -> pathMatcher.match(uri, path));

        if (isPublic) {
            return false;
        }

        // 🔓 GET public doar pe anumite endpoints
        if ("GET".equalsIgnoreCase(method)) {
            boolean isOpenGet = openGetEndpoints.stream()
                    .anyMatch(uri -> pathMatcher.match(uri, path));
            if (isOpenGet) {
                return false;
            }
        }

        return true;
    };
}
