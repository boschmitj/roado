package com.roado.demo.Mappers;


import org.springframework.stereotype.Component;

import com.roado.demo.DTOs.UserDTO;
import com.roado.demo.Model.User;

@Component
public class UserMapper {

    public UserDTO toDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setUserId( user.getId() );
        userDTO.setNickname( user.getNickname() );
        userDTO.setEmail( user.getEmail() );

        return userDTO;
    }

    public User toEntity(UserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        User user = new User();

        user.setId( userDTO.getUserId() );
        user.setEmail( userDTO.getEmail() );

        return user;
    }
}
