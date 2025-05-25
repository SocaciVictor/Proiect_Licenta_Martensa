package org.demo.orderservice.mapper;

import org.demo.orderservice.dto.OrderItemDto;
import org.demo.orderservice.model.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItemDto toDto(OrderItem item);
}
