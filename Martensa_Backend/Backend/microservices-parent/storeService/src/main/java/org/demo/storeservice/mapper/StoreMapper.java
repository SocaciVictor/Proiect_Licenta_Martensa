package org.demo.storeservice.mapper;

import org.demo.storeservice.dto.request.StoreRequest;
import org.demo.storeservice.dto.response.StoreResponse;
import org.demo.storeservice.model.Store;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StoreMapper {

    @Mappings({
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "location", source = "location"),
            @Mapping(target = "openingHours", source = "openingHours"),
            @Mapping(target = "contactNumber", source = "contactNumber"),
            @Mapping(target = "managerName", source = "managerName"),
            @Mapping(target = "availableServices", source = "availableServices")
    })
    Store toEntity(StoreRequest request);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "location", source = "location"),
            @Mapping(target = "openingHours", source = "openingHours"),
            @Mapping(target = "contactNumber", source = "contactNumber"),
            @Mapping(target = "managerName", source = "managerName"),
            @Mapping(target = "availableServices", source = "availableServices")
    })
    StoreResponse toResponse(Store store);

    @Mappings({
            @Mapping(target = "id", ignore = true)
    })
    void updateStoreFromRequest(StoreRequest request, @MappingTarget Store store);


    List<StoreResponse> toResponseList(List<Store> stores);
}
