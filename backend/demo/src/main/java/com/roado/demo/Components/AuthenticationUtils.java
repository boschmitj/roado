package com.roado.demo.Components;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.roado.demo.Model.User;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticationUtils {

    private final Authentication authentication;

    public User getCurrentlyAuthenticatedUser() {
        return (User) authentication.getPrincipal();
    }
}
