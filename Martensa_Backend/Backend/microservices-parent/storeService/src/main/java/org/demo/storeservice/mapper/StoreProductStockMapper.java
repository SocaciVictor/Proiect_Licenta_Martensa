package org.demo.storeservice.mapper;

import org.demo.storeservice.dto.StoreProductStockDto;
import org.demo.storeservice.model.StoreProductStock;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StoreProductStockMapper {

    @Mapping(target = "storeId", source = "store.id")
    StoreProductStockDto toDto(StoreProductStock entity);

    List<StoreProductStockDto> toDtoList(List<StoreProductStock> list);
}
