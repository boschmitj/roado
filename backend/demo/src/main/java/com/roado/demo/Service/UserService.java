package com.roado.demo.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.roado.demo.Model.User;
import com.roado.demo.Repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }


    public List<User> allUsers() {
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }

    public UserDetails loadUserByUsername(String email) {
        return (UserDetails) userRepository.findByEmail(email).orElse(null);
    }
}
