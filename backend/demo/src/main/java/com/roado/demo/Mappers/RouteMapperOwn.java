package com.roado.demo.Mappers;

import java.beans.JavaBean;

import org.springframework.stereotype.Component;

import com.roado.demo.DTOs.RouteDTO;
import com.roado.demo.Model.Route;
import com.roado.demo.Repository.UserRepository;

@Component
public class RouteMapperOwn {

    private final UserRepository userRepository;

    public RouteMapperOwn(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public RouteDTO toRouteDTO(Route route) {
        return RouteDTO.builder()
            .createdBy(route.getCreatedBy().getId())
            .name(route.getName())
            .geoData(route.getGeoData())
            .distanceM(route.getDistanceM())
            .elevationProfile(route.getElevationProfile())
            .durationS(route.getDurationS())
            .build();
    }

    public Route toRoute(RouteDTO routeDTO) {
        System.out.println(routeDTO.getGeoData() == null ? "GeoJson ist null" : routeDTO.getGeoData());
        return Route.builder()
            .createdBy(userRepository.findById(routeDTO.getCreatedBy()).orElseThrow(() -> new IllegalArgumentException("Der Nutzer wurde nicht gefunden")))
            .distanceM(routeDTO.getDistanceM())
            .durationS(routeDTO.getDurationS())
            .elevationProfile(routeDTO.getElevationProfile())
            .geoData(routeDTO.getGeoData())
            .name(routeDTO.getName())
            .build();
    }
}
