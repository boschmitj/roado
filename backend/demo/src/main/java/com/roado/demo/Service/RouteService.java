package com.roado.demo.Service;


import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.List;
import java.util.Map;

import org.locationtech.jts.io.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.GetRouteDTO;
import com.roado.demo.DTOs.RouteDTO;

import com.roado.demo.Mappers.RouteMapperOwn;
import com.roado.demo.Model.Route;
import com.roado.demo.Model.User;
import com.roado.demo.Repository.RouteRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteMapperOwn routeMapper;
    private final AuthenticationService authenticationService;
    private final RouteUtils routeUtils;

    @Value("${OPENROUTESEVICES_API_KEY}")
    private String OPENROUTESEVICES_API_KEY; 

    public RouteService(RouteRepository routeRepository, 
                        RouteMapperOwn routeMapper,
                        AuthenticationService authenticationService,
                        RouteUtils routeUtils) {
        this.routeRepository = routeRepository;
        this.routeMapper = routeMapper;
        this.authenticationService = authenticationService;
        this.routeUtils = routeUtils;
    }

    public RouteDTO getRouteDTO(Long routeId) {
        Route route = getRoute(routeId);      
        if (route != null) {
            return routeMapper.toRouteDTO(route);
        }
        return null;
    }

    public Route getRoute(Long routeId) {
        Route route = routeRepository.findById(routeId).orElse(null);
        return route;
    }

    public String getRouteGeoJson(Long id) {
        Route route = getRoute(id);
        if (route != null) {
            return routeUtils.geometryToString(route.getGeoData());
        }
        return null;
    }

    public RouteDTO addRoute(RouteDTO routeDTO) throws AuthenticationException, IllegalArgumentException, ParseException {
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

    public List<GetRouteDTO> getRoutesForUser(User user) throws Exception{

        List<GetRouteDTO> routes = routeRepository.findAllByCreatedBy(user)
            .stream().map(r -> routeMapper.toGetRouteDTO(r)).toList();

        if (routes.isEmpty()) {
            throw new Exception("No routes found");
        }

        return routes;
    }

    





    
}
