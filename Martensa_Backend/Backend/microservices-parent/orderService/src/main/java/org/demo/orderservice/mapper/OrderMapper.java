package org.demo.orderservice.mapper;

import org.demo.orderservice.dto.ProductDTO;
import org.demo.orderservice.dto.request.OrderRequest;
import org.demo.orderservice.dto.response.OrderResponse;
import org.demo.orderservice.model.Order;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderDate", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "orderStatus", constant = "PENDING")
    @Mapping(target = "trackingNumber", ignore = true)
    @Mapping(target = "products", source = "products")
    Order toEntity(OrderRequest request, Long userId, List<ProductDTO> products, @Context java.math.BigDecimal total);

    @Mapping(target = "products", source = "products")
    OrderResponse toResponse(Order order);
}

