package org.demo.orderservice.mapper;

import org.demo.orderservice.dto.request.OrderRequest;
import org.demo.orderservice.dto.response.OrderResponse;
import org.demo.orderservice.model.Order;
import org.demo.orderservice.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring", uses = OrderItemMapper.class)
public interface OrderMapper {

    @Mapping(target = "id",              ignore = true)
    @Mapping(target = "userId",          source = "userId")
    @Mapping(target = "orderDate",       expression = "java(LocalDate.now())")
    @Mapping(target = "orderStatus",     constant = "PENDING")
    @Mapping(target = "shippingAddress", source = "request.shippingAddress")
    @Mapping(target = "paymentMethod",   source = "request.paymentMethod")
    @Mapping(target = "trackingNumber",  ignore = true)
    @Mapping(target = "totalAmount",     source = "total")
    @Mapping(target = "items",           source = "items")
    @Mapping(target = "storeId",         source = "request.storeId")
    Order toEntity(OrderRequest request,
                   Long userId,
                   List<OrderItem> items,
                   BigDecimal total);

    OrderResponse toResponse(Order order);
}

