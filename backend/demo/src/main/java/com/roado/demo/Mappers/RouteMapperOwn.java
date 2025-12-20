package com.roado.demo.Mappers;


import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Component;

import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.GetRouteDTO;
import com.roado.demo.DTOs.RouteDTO;
import com.roado.demo.Model.Route;
import com.roado.demo.Repository.UserRepository;

@Component
public class RouteMapperOwn {

    private final UserRepository userRepository;
    private final RouteUtils routeUtils;

    public RouteMapperOwn(UserRepository userRepository, RouteUtils routeUtils) {
        this.userRepository = userRepository;
        this.routeUtils = routeUtils;
    }


    public RouteDTO toRouteDTO(Route route) {
        return RouteDTO.builder()
            .name(route.getName())
            .geoData(routeUtils.geometryToString(route.getGeoData()))
            .distanceM(route.getDistanceM())
            .elevationProfile(route.getElevationProfile())
            .durationS(route.getDurationS())
            .svgPreview(route.getSvgPreview())
            .elevationGain(route.getElevationGain())
            .build();
    }

    public GetRouteDTO toGetRouteDTO(Route route) {
        return GetRouteDTO.builder()
                .id(route.getRouteId())
                .name(route.getName())
                .geoData(routeUtils.geometryToString(route.getGeoData()))
                .distanceM(route.getDistanceM())
                .elevationGain(route.getElevationGain())
                .elevationProfile(route.getElevationProfile())
                .svgPreview(route.getSvgPreview())
                .durationS(route.getDurationS())
            .build();
    }

    public Route toRoute(RouteDTO routeDTO, Long createdBy) throws IllegalArgumentException, ParseException {
        System.out.println(routeDTO.getGeoData() == null ? "GeoJson ist null" : routeDTO.getGeoData());
        return Route.builder()
            .createdBy(userRepository.findById(createdBy).orElseThrow(() -> new IllegalArgumentException("Der Nutzer wurde nicht gefunden")))
            .distanceM(routeDTO.getDistanceM())
            .durationS(routeDTO.getDurationS())
            .elevationProfile(routeDTO.getElevationProfile())
            .geoData(routeUtils.routeStringToGeometry(routeDTO.getGeoData()))
            .name(routeDTO.getName())
            .svgPreview(routeDTO.getSvgPreview())
            .elevationGain(routeDTO.getElevationGain())
            .build();
    }
}
