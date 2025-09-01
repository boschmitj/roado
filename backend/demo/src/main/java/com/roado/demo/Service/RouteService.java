package com.roado.demo.Service;


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

    
}
