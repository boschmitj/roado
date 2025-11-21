package com.roado.demo.Helpers;

import java.util.Optional;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;

@Component
public class JwtCookieService {

    public Cookie createAccessTokenCookie(String jwt) {
        Cookie cookie = new Cookie("ACCESS_TOKEN", jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); //TODO: Change for production when using https
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "Lax");
        cookie.setMaxAge(2*60);
        return cookie;
    }

    public Cookie createRefreshTokenCookie(String refreshJwt) {
        Cookie cookie = new Cookie("REFRESH_TOKEN", refreshJwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); //TODO: Change for production when using https
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 Tage
        return cookie;
    }

    public Optional<Cookie> extractAccessCookie(Cookie[] cookies) {
        if(cookies!= null) {
            for (Cookie cookie : cookies) {
                if ("access_token".equals(cookie.getName().toLowerCase())) {
                    return Optional.of(cookie);
                }
            }
        }
        return Optional.empty(); 
    }


}
