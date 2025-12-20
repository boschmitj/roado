package com.roado.demo.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.LoginUserDto;
import com.roado.demo.DTOs.RegisterUserDto;
import com.roado.demo.Helpers.JwtCookieService;
import com.roado.demo.Model.User;
import com.roado.demo.Service.AuthenticationService;
import com.roado.demo.Service.JwtService;
import com.roado.demo.Service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/auth")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {
    private final JwtService jwtService;
    
    private final AuthenticationService authenticationService;
    private final JwtCookieService jwtCookieService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto, HttpServletResponse response) {
        User registeredUser = authenticationService.signUpAndAuthenticate(registerUserDto);

        UserDetails userDetails = (UserDetails) registeredUser;
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        response.addCookie(jwtCookieService.createAccessTokenCookie(accessToken));
        response.addCookie(jwtCookieService.createRefreshTokenCookie(refreshToken));
        
        return ResponseEntity.ok(Map.of("message", "Registration + login successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserDto loginUserDto, HttpServletResponse response) {

        // also sets the security context to the created User authentication
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String accessToken = jwtService.generateAccessToken(authenticatedUser);
        String refreshToken = jwtService.generateRefreshToken(authenticatedUser);

        response.addCookie(jwtCookieService.createAccessTokenCookie(accessToken));
        response.addCookie(jwtCookieService.createRefreshTokenCookie(refreshToken));

        return ResponseEntity.ok(Map.of("message", "Login successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "REFRESH_TOKEN", required = false) String refreshToken,   
                                            HttpServletResponse response) {
        if (refreshToken == null || 
            refreshToken.isEmpty() ||
            !("refresh".equals(jwtService.extractTokenType(refreshToken)))
        ) {
            return ResponseEntity.status(401).body("No refresh token provided");
        }

        log.info((jwtService.extractTokenType(refreshToken)));

        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userService.loadUserByUsername(username);  // need to change back to cast (UserDetails)?

        if (userDetails == null) {
            return ResponseEntity.badRequest().body("The corresponding user was not found");
        }
        
        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateAccessToken(userDetails);
        response.addCookie(jwtCookieService.createAccessTokenCookie(newAccessToken));

        return ResponseEntity.ok(Map.of("message", "Access token refreshed"));
            
    }

    
}