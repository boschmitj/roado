package com.roado.demo.Config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.roado.demo.Repository.UserRepository;
import com.roado.demo.Service.JwtService;
import com.roado.demo.Helpers.JwtCookieService;
import com.roado.demo.Model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final JwtCookieService jwtCookieService;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        

        OAuth2User oidcUser = (OAuth2User) authentication.getPrincipal();
        String email = oidcUser.getAttribute("email");

        UserDetails user = (UserDetails) userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setProvider("GOOGLE");
                    newUser.setMethod("oauth2");
                    return userRepository.save(newUser);
                });

        

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        response.addCookie(jwtCookieService.createAccessTokenCookie(accessToken));
        response.addCookie(jwtCookieService.createRefreshTokenCookie(refreshToken));
        // this.setDefaultTargetUrl("http://localhost:3000/home");

        getRedirectStrategy().sendRedirect(request, response, "http://localhost:3000/home");
        
    } 
    
}
