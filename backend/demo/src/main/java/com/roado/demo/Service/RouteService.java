package com.roado.demo.Service;


import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.roado.demo.DTOs.RouteDTO;
import com.roado.demo.Mappers.RouteMapper;
import com.roado.demo.Model.Route;
import com.roado.demo.Model.User;
import com.roado.demo.Repository.RouteRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final UserService userService;
    private final RouteMapper routeMapper;

    @Value("${OPENROUTESEVICES_API_KEY}")
    private String OPENROUTESEVICES_API_KEY; 

    public RouteService(RouteRepository routeRepository, 
                        UserService userService,
                        RouteMapper rotueMapper) {
        this.routeRepository = routeRepository;
        this.userService = userService;
        this.routeMapper = rotueMapper;
    }

    public RouteDTO getRoute(Long routeId) {
        Route route = routeRepository.findById(routeId).orElse(null);        
        if (route != null) {
            return routeMapper.toDTO(route);
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
        if (routeDTO.getRouteId() != null) {
            throw new IllegalArgumentException("Route id must be null.");  
        }
        User user = userService.getUser(routeDTO.getCreatedBy());
        if (user == null) {
            throw new EntityNotFoundException("User with id " + routeDTO.getCreatedBy() + " does not exist.");
        } else {
            Route route = routeMapper.toEntity(routeDTO);
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

    public String calculateRouteGeoJson(String waypoints) {
        String encodedCoords = encodeWaypoints(waypoints);

        HttpRequest.BodyPublisher bodyPublisher = HttpRequest.BodyPublishers.ofString(encodedCoords);
        try {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(new URI("routeCalcEndpointORC"))
                .POST(bodyPublisher)
                .build();
        } catch (URISyntaxException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return "";
    }

    private String encodeWaypoints(String waypoints) {
        StringBuilder sb = new StringBuilder();
        sb.append("[")
        for (String coordPair : waypoints.split("|")) {
            sb.append("[" + coordPair + "],");
        }
        sb.replace(sb.length()-1, sb.length(), "]");

        return sb.toString();
     
    }

    
}
