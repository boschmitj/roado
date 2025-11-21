package com.roado.demo.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.CoordinateDTO;
import com.roado.demo.DTOs.RouteDTO;
import com.roado.demo.Service.RouteService;

import jakarta.persistence.EntityNotFoundException;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/route")
public class RouteController {

    private RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping("/routeInfo")
    public ResponseEntity<?> getRouteInfo(@RequestParam Long id) {
        RouteDTO result = routeService.getRoute(id);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result.toString());
    }

    @GetMapping("/routeGeoJson")
    public ResponseEntity<?> getRouteGeoJson(@RequestParam Long id) {
        String result = routeService.getRouteGeoJson(id);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/addRoute")
    public ResponseEntity<?> addRoute(@RequestBody RouteDTO routeDTO) {
        try {
            RouteDTO result = routeService.addRoute(routeDTO);
            if (result == null) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok("Succeffully added route: \n" + result);
        } catch (EntityNotFoundException enfe) {
            return ResponseEntity.badRequest().body("The route user could not be found" + enfe.getMessage());
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body("The route id must be null" + iae.getMessage());
        }
    }

    @PostMapping("/calcRouteGeoJson")
    public ResponseEntity<?> calculateGeoJson(@RequestBody CoordinateDTO coordinateDTO) {
        List<List<Double>> waypoints = coordinateDTO.getCoordinates();
        String geoJson = routeService.calculateRouteGeoJson(waypoints, coordinateDTO.getElevation());
        if (geoJson != null) {
            return (ResponseEntity<?>) ResponseEntity.ok(geoJson);
        }
        return ResponseEntity.badRequest().body("An error occured while trying to create a route");
       
    }
    

    
    // only for testing and filling the database rn
    @PostMapping("/addRoutes")
    public ResponseEntity<String> addRoutes(@RequestBody List<RouteDTO> routeDTOList) {
        List<RouteDTO> addedRoutes = new ArrayList<>();
        for (RouteDTO routeDTO : routeDTOList) {
            try {
                RouteDTO result = routeService.addRoute(routeDTO);
                if (result != null) {
                    addedRoutes.add(result);
                } else {
                    return ResponseEntity.badRequest().body("Failed to add route " + routeDTO.toString());
                }
            } catch (EntityNotFoundException enfe) {
                return ResponseEntity.badRequest().body("The route user could not be found" + enfe.getMessage());
            }
        
        }
        if (addedRoutes.size() > 0) {
            return ResponseEntity.ok("Succeffully added routes: \n" + addedRoutes);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }    
}
