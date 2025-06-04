package org.demo.productservice.mapper;

import org.demo.productservice.dto.PromotionDto;
import org.demo.productservice.model.Promotion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PromotionMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "discountPercentage", source = "discountPercentage")
    @Mapping(target = "startDate", source = "startDate")
    @Mapping(target = "endDate", source = "endDate")
    @Mapping(target = "promotionType", source = "promotionType")
    PromotionDto toDto(Promotion promotion);

    List<PromotionDto> toDtoList(List<Promotion> promotions);
}
