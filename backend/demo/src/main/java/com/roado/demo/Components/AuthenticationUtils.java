package com.roado.demo.Components;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.roado.demo.Model.User;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticationUtils {


    public User getCurrentlyAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new IllegalStateException("No authenticated user");
        }
        
        return user;
    }
}
