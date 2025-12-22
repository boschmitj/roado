package com.roado.demo.Service;


import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.List;
import java.util.Map;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roado.demo.DTOs.GetRouteDTO;
import com.roado.demo.DTOs.RouteDTO;

import com.roado.demo.Mappers.RouteMapperOwn;
import com.roado.demo.Model.RoutePlan;
import com.roado.demo.Model.User;
import com.roado.demo.Repository.RouteRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RouteService {

    private final RouteRepository routeRepository;
    private final RouteMapperOwn routeMapper;
    private final AuthenticationService authenticationService;
    private static final Double ELEVATION_THRESHOLD = 2.0;

    @Value("${OPENROUTESEVICES_API_KEY}")
    private String OPENROUTESEVICES_API_KEY; 

    private ObjectMapper objectMapper;

    public RouteService(RouteRepository routeRepository, 
                        RouteMapperOwn routeMapper,
                        AuthenticationService authenticationService,
                        ObjectMapper objectMapper
                        ) {
        this.routeRepository = routeRepository;
        this.routeMapper = routeMapper;
        this.authenticationService = authenticationService;
        this.objectMapper = objectMapper;
    }

    public RouteDTO getRouteDTO(Long routeId) throws JsonMappingException, JsonProcessingException {
        RoutePlan route = getRoute(routeId);      
        if (route != null) {
            return routeMapper.toRouteDTO(route);
        }
        return null;
    }

    public RoutePlan getRoute(Long routeId) {
        RoutePlan route = routeRepository.findById(routeId).orElse(null);
        return route;
    }

    public JsonNode getRouteGeoJson(Long id) {
        RoutePlan route = getRoute(id);
        if (route != null) {
            return route.getGeoJson();
        }
        return null;
    }

    public RouteDTO addRoute(RouteDTO routeDTO) throws AuthenticationException, IllegalArgumentException, ParseException, JsonProcessingException {
        User user = authenticationService.getAuthenticatedUser();
        
        RoutePlan route = routeMapper.toRouteWithNewTrack(routeDTO, user.getId());
        route.setCreatedBy(user);
        RoutePlan savedRoute = routeRepository.save(route);
        
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
            .stream().map(r -> {
                try {
                    return routeMapper.toGetRouteDTO(r);
                } catch (JsonMappingException e) {
                    return null;
                } catch (JsonProcessingException e) {
                    return null;
                }
            }).toList();

        if (routes.isEmpty()) {
            throw new Exception("No routes found");
        }

        return routes;
    }

    public Double computeElevationGain(LineString trackLine) throws URISyntaxException, IOException, InterruptedException {
        if (trackLine.hasDimension(3)) {
            return sumThirdDimension(trackLine);
        }
        return sumThirdDimension(enrichLineString3D(trackLine));
    }

    private Double sumThirdDimension(JsonNode enrichedJson3D) {
        Double elevation = 0.0;
        if (enrichedJson3D != null && enrichedJson3D.isArray()) {
            for (int i = 0; i < enrichedJson3D.size(); i++) {
                JsonNode coord = enrichedJson3D.get(i);

                double z = coord.get(2).asDouble();

                if (i > 0) {
                    JsonNode prev = enrichedJson3D.get(i - 1);
                    double zPrev = prev.get(2).asDouble();

                    double deltaZ = z - zPrev;
                    if (deltaZ > ELEVATION_THRESHOLD) {
                        elevation += deltaZ;
                    }
                    
                }
            }
        }

        return elevation;
    }

    private Double sumThirdDimension(LineString enrichedLineString3D) {
        Double elevation = 0.0;
        Coordinate[] coords = enrichedLineString3D.getCoordinates();
        for (int i = 0; i < coords.length; i++) {

            double z = coords[i].z;
            if (i > 0) {
                double prevZ = coords[i - 1].z;
                
                double deltaZ = z - prevZ;
                if (deltaZ > ELEVATION_THRESHOLD) {
                    elevation += deltaZ;
                }
            }
        }

        return elevation;
    }

    public JsonNode enrichLineString3D(LineString trackLine) throws URISyntaxException, IOException, InterruptedException {
        String body = objectMapper.writeValueAsString(Map.of("format_in", "polyline",
                                                            "format_out", "polyline",
                                                            "dataset", "strm",
                                                            "geometry", trackLine                                                            
        ));
        HttpClient httpClient = HttpClient.newHttpClient();
        HttpRequest.BodyPublisher bodyPublisher = HttpRequest.BodyPublishers.ofString(body); 
        
        HttpRequest httpRequest = HttpRequest.newBuilder()
            .uri(new URI("https://api.openrouteservice.org/elevation/line"))
            .POST(bodyPublisher)
            .header("Authorization", OPENROUTESEVICES_API_KEY)
            .header("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8")
            .header("Content-Type", "application/json; charset=utf-8")
            .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, BodyHandlers.ofString());
        JsonNode responseJson = objectMapper.readTree(httpResponse.body());

        JsonNode geometryNode = responseJson.path("geometry");

        if (geometryNode.isMissingNode()) {
            throw new RuntimeException("No geometry returned from elevation API");
        }

        return geometryNode;
    }

    





    
}
