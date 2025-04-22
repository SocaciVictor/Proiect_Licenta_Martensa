package com.martensa.userService.mapper;

import com.martensa.userService.dto.request.UserDto;
import com.martensa.userService.model.Role;
import com.martensa.userService.model.User;
import com.martensa.userService.model.enums.UserRole;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "email", source = "email")
    @Mapping(target = "password", source = "encryptedPassword")
    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRolesToEntities")
    User toEntity(UserDto dto);

    @Mapping(target = "encryptedPassword", source = "password")
    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRolesToStrings")
    UserDto toDto(User user);

    @Named("mapRolesToEntities")
    static Set<Role> mapRolesToEntities(List<String> roles) {
        return roles.stream()
                .map(roleNameStr -> {
                    Role role = new Role();
                    role.setRoleName(UserRole.valueOf(roleNameStr));
                    return role;
                })
                .collect(Collectors.toSet());
    }

    @Named("mapRolesToStrings")
    static List<String> mapRolesToStrings(Set<Role> roles) {
        return roles.stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toList());
    }
}

