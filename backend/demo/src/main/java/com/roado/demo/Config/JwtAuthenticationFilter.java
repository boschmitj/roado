package com.roado.demo.Config;



import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.roado.demo.Helpers.JwtCookieService;
import com.roado.demo.Service.JwtService;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtCookieService cookieService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        log.debug("JwtFilter: incoming request {} {}", request.getMethod(), request.getRequestURI());
        // final String authHeader = request.getHeader("Authorization");

        Optional<Cookie> cookieOpt = cookieService.extractAccessCookie(request.getCookies());
        Cookie cookie;
        String jwt;
        if (cookieOpt.isPresent()) {
            cookie = cookieOpt.get();
            jwt = cookie.getValue();
        } else {
            filterChain.doFilter(request, response);
            return;
        }

        // if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        //     Cookie[] cookies = request.getCookies();
        //     if (cookies != null) for (Cookie c : cookies) log.debug("Cookie: {}={}", c.getName(), c.getValue()!=null ? "[...]" : "null");
        //     filterChain.doFilter(request, response);
        //     return;
        // }
        try {
            // final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);

            // if wrong token type, stay unauthenticated
            String tokenType = jwtService.extractTokenType(jwt);
            if ("refresh".equals(tokenType)) {
                filterChain.doFilter(request, response);
                return;
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (userEmail != null && authentication == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            handlerExceptionResolver.resolveException(request, response, null, exception);
            // log.error("JWT validation failed", exception);
            // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT invalid");
            return;
        }

    }

    
}
