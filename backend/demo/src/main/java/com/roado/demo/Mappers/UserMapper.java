package com.roado.demo.Mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.roado.demo.DTOs.UserDTO;
import com.roado.demo.Model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "userId")
    UserDTO toDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "activities", ignore = true)
    @Mapping(target = "routes", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(source = "userId", target = "id")
    User toEntity(UserDTO userDTO);

}
