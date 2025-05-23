package com.martensa.userService.mapper;

import com.martensa.userService.dto.request.UserDto;
import com.martensa.userService.dto.request.UserUpdateRequest;
import com.martensa.userService.dto.response.LoyaltyCardResponse;
import com.martensa.userService.dto.response.UserProfileResponse;
import com.martensa.userService.dto.response.UserSummaryResponse;
import com.martensa.userService.model.LoyaltyCard;
import com.martensa.userService.model.Role;
import com.martensa.userService.model.User;
import com.martensa.userService.model.enums.UserRole;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.*;


@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "password", source = "password"),
            @Mapping(target = "firstName", source = "firstName"),
            @Mapping(target = "lastName", source = "lastName"),
            @Mapping(target = "address", source = "address"),
            @Mapping(target = "phoneNumber", source = "phoneNumber"),
            @Mapping(target = "dateOfBirth", source = "dateOfBirth"),
            @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRolesToEntities")
    })
    User toEntity(UserDto dto);

    @Mappings({
            @Mapping(target = "password", source = "password"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "firstName", source = "firstName"),
            @Mapping(target = "lastName", source = "lastName"),
            @Mapping(target = "address", source = "address"),
            @Mapping(target = "phoneNumber", source = "phoneNumber"),
            @Mapping(target = "dateOfBirth", source = "dateOfBirth"),
            @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRolesToStrings")
    })
    UserDto toDto(User user);

    @Named("mapRolesToEntities")
    default Set<Role> mapRolesToEntities(List<String> roles) {
        return roles.stream()
                .map(roleNameStr -> {
                    Role role = new Role();
                    role.setRoleName(UserRole.valueOf(roleNameStr));
                    return role;
                })
                .collect(Collectors.toSet());
    }

    @Named("mapRolesToStrings")
    default List<String> mapRolesToStrings(Set<Role> roles) {
        return roles.stream()
                .map(role -> role.getRoleName().name())
                .collect(Collectors.toList());
    }

    @Mapping(target = "loyaltyCard", expression = "java(mapLoyalty(user.getLoyaltyCard()))")
    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRolesToStrings")
    UserProfileResponse toUserProfile(User user);

    default LoyaltyCardResponse mapLoyalty(LoyaltyCard card) {
        return new LoyaltyCardResponse(card.getCardNumber(), card.getPoints());
    }

    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "loyaltyCard", ignore = true)
    @Mapping(target = "isOAuthAccount", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);

    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRolesToStrings")
    UserSummaryResponse toUserSummary(User user);

    List<UserSummaryResponse> toUserSummaryList(List<User> users);


}

