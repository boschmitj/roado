package com.roado.demo.Controller;

import java.net.ResponseCache;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.UserDTO;
import com.roado.demo.Mappers.UserMapper;
import com.roado.demo.Model.User;
import com.roado.demo.Service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> authenticatedUser() {
        log.info("Getting users/me");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.debug("Authentication of me: {}", authentication.getCredentials());
        User currentUser = (User) authentication.getPrincipal();
        UserDTO userDTO = userMapper.toDto(currentUser);
        log.debug("Found user: {}", userDTO);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/")
    public ResponseEntity<List<UserDTO>> allUsers() {
        List <User> users = userService.allUsers();

        return ResponseEntity.ok(users.stream().map(u -> userMapper.toDto(u)).toList());
    }

}
