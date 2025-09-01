package com.roado.demo.Service;

import org.springframework.stereotype.Service;

import com.roado.demo.DTOs.UserDTO;
import com.roado.demo.Mappers.UserMapper;
import com.roado.demo.Model.User;
import com.roado.demo.Repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                        UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public UserDTO addUser(UserDTO user) throws Exception{
        User newUser = userMapper.toEntity(user);
        User savedUser = userRepository.save(newUser);
        return userMapper.toDto(savedUser);
    }
}
