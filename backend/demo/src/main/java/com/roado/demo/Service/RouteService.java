package com.roado.demo.Service;


import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roado.demo.DTOs.RouteDTO;

import com.roado.demo.Mappers.RouteMapperOwn;
import com.roado.demo.Model.Route;
import com.roado.demo.Model.User;
import com.roado.demo.Repository.RouteRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RouteService {

    private final RouteRepository routeRepository;
    private final UserService userService;
    private final RouteMapperOwn routeMapper;
    private final AuthenticationService authenticationService;

    @Value("${OPENROUTESEVICES_API_KEY}")
    private String OPENROUTESEVICES_API_KEY; 

    public RouteService(RouteRepository routeRepository, 
                        UserService userService,
                        RouteMapperOwn rotueMapper,
                        AuthenticationService authenticationService) {
        this.routeRepository = routeRepository;
        this.userService = userService;
        this.routeMapper = rotueMapper;
        this.authenticationService = authenticationService;
    }

    public RouteDTO getRoute(Long routeId) {
        Route route = routeRepository.findById(routeId).orElse(null);        
        if (route != null) {
            return routeMapper.toRouteDTO(route);
        }
        return null;
    }

    public String getRouteGeoJson(Long id) {
        Route route = routeRepository.findById(id).orElse(null);
        if (route != null) {
            return route.getGeoData();
        }
        return null;
    }

    public RouteDTO addRoute(RouteDTO routeDTO) throws AuthenticationException {
        User user = authenticationService.getAuthenticatedUser();
        
        Route route = routeMapper.toRoute(routeDTO, user.getId());
        route.setCreatedBy(user);
        Route savedRoute = routeRepository.save(route);
        
        return routeMapper.toRouteDTO(savedRoute);
    }

    public String calculateRouteGeoJson(List<List<Double>> waypoints, Boolean elevation) {

        log.info("Calculating route...");
        log.info("Waypoints are " + waypoints);

        ObjectMapper objectMapper = new ObjectMapper();
        String coordinates;
        try {
            coordinates = objectMapper.writeValueAsString(Map.of("coordinates", waypoints, "elevation", elevation));
        } catch (JsonProcessingException e) {
            return null;
        }

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest.BodyPublisher bodyPublisher = HttpRequest.BodyPublishers.ofString(coordinates);
        
        try {
            

            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(new URI("https://api.openrouteservice.org/v2/directions/cycling-road/geojson"))
                .POST(bodyPublisher)
                .header("Authorization", OPENROUTESEVICES_API_KEY)
                .header("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8")
                .header("Content-Type", "application/json; charset=utf-8")
                .build();
            
            HttpResponse<String> response = client.send(httpRequest, BodyHandlers.ofString());
            String route = response.body();
            log.info("Calculated route " + route);
            return route;
            
        } catch (Exception e) {
            return null;
        }
    }

    public List<RouteDTO> getRoutesForUser(User user) throws Exception{

        List<RouteDTO> routes = routeRepository.findAllByCreatedBy(user)
            .stream().map(r -> routeMapper.toRouteDTO(r)).toList();

        if (routes.isEmpty()) {
            throw new Exception("No routes found");
        }

        return routes;
    }

    
}
