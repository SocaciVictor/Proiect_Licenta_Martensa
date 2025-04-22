package org.demo.authservice.mapper;

import org.demo.authservice.dto.RegisterRequest;
import org.demo.authservice.dto.UserDto;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "encryptedPassword", source = "password")
    @Mapping(target = "roles", expression = "java(java.util.List.of(\"ROLE_CUSTOMER\"))")
    UserDto toUserDto(RegisterRequest request, @Context String encryptedPassword);
}



