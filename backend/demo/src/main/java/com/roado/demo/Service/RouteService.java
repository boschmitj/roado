package com.roado.demo.Service;


import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
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

    @Value("${OPENROUTESEVICES_API_KEY}")
    private String OPENROUTESEVICES_API_KEY; 

    public RouteService(RouteRepository routeRepository, 
                        UserService userService,
                        RouteMapperOwn rotueMapper) {
        this.routeRepository = routeRepository;
        this.userService = userService;
        this.routeMapper = rotueMapper;
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

    public RouteDTO addRoute(RouteDTO routeDTO)  {
        User user = userService.getUser(routeDTO.getCreatedBy());
        if (user == null) {
            throw new EntityNotFoundException("User with id " + routeDTO.getCreatedBy() + " does not exist.");
        } else {
            Route route = routeMapper.toRoute(routeDTO);
            route.setCreatedBy(user);
            routeRepository.save(route);
        }
        return routeDTO;
    }


    //Not done yet, trying to fetch from open route services 
    // somth like this
    // Client client = ClientBuilder.newClient();
    // Entity<String> payload = Entity.json({"coordinates":[[8.681495,49.41461],[8.686507,49.41943],[8.687872,49.420318]]});
    // Response response = client.target("https://api.openrouteservice.org/v2/directions/cycling-road/geojson")
    //   .request()
    //   .header("Authorization", "your-api-key")
    //   .header("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8")
    //   .header("Content-Type", "application/json; charset=utf-8")
    //   .post(payload);

    // System.out.println("status: " + response.getStatus());
    // System.out.println("headers: " + response.getHeaders());
    // System.out.println("body:" + response.readEntity(String.class));

    public String calculateRouteGeoJson(List<List<Double>> waypoints) {

        log.info("Calculating route...");
        log.info("Waypoints are " + waypoints);

        ObjectMapper objectMapper = new ObjectMapper();
        String coordinates;
        try {
            coordinates = objectMapper.writeValueAsString(Map.of("coordinates", waypoints));
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

    // private String encodeWaypoints(String waypoints) {
    //     StringBuilder sb = new StringBuilder();
    //     sb.append("[")
    //     for (String coordPair : waypoints.split("|")) {
    //         sb.append("[" + coordPair + "],");
    //     }
    //     sb.replace(sb.length()-1, sb.length(), "]");

    //     return sb.toString();
     
    // }

    
}
