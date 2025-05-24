package org.demo.orderservice.dto;

public record UserSummaryDto(
        Long id,
        String email,
        String name
) {}
