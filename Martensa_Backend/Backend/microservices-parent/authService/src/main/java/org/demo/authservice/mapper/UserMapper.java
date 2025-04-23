package org.demo.authservice.mapper;

import org.demo.authservice.dto.RegisterRequest;
import org.demo.authservice.dto.UserDto;
import org.mapstruct.*;


@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mappings({
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "password", source = "password"), // din @Context
            @Mapping(target = "firstName", source = "firstName"),
            @Mapping(target = "lastName", source = "lastName"),
            @Mapping(target = "address", source = "address"),
            @Mapping(target = "phoneNumber", source = "phoneNumber"),
            @Mapping(target = "dateOfBirth", source = "dateOfBirth"),
            @Mapping(target = "roles", expression = "java(java.util.List.of(\"ROLE_CUSTOMER\"))")
    })
    UserDto toUserDto(RegisterRequest request, @Context String encryptedPassword);
}



