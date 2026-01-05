package com.roado.demo.Mappers;


import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.GetRouteDTO;
import com.roado.demo.DTOs.RouteDTO;
import com.roado.demo.Model.RoutePlan;
import com.roado.demo.Model.Track;
import com.roado.demo.Repository.TrackRepository;
import com.roado.demo.Repository.UserRepository;

@Component
public class RouteMapperOwn {

    private final UserRepository userRepository;
    private final TrackRepository trackRepository;
    private final RouteUtils routeUtils;

    public RouteMapperOwn(UserRepository userRepository, RouteUtils routeUtils, TrackRepository trackRepository) {
        this.userRepository = userRepository;
        this.routeUtils = routeUtils;
        this.trackRepository = trackRepository;
    }


    public RouteDTO toRouteDTO(RoutePlan route) throws JsonMappingException, JsonProcessingException {
        return RouteDTO.builder()
            .name(route.getName())
            .geoJson(route.getGeoJson())
            .distanceM(route.getDistanceM())
            .durationS(route.getDurationS())
            .svgPreview(route.getSvgPreview())
            .elevationGain(route.getElevationGain())
            .build();
    }

    public GetRouteDTO toGetRouteDTO(RoutePlan route, Long trackId) throws JsonMappingException, JsonProcessingException {
        return GetRouteDTO.builder()
                .id(route.getRouteId())
                .name(route.getName())
                .distanceM(route.getDistanceM())
                .elevationGain(route.getElevationGain())
                .elevationProfile(route.getElevationProfile())
                .durationS(route.getDurationS())
                .trackImageUrl("/staticmap/getImageTrack/" + trackId)
            .build();
    }

    public RoutePlan toRouteWithNewTrack(RouteDTO routeDTO, Long createdBy) throws IllegalArgumentException, ParseException, JsonProcessingException {
        System.out.println(routeDTO.getGeoJson() == null ? "GeoJson ist null" : routeDTO.getGeoJson());
        LineString geometry = routeUtils.getRouteLine(routeUtils.coordsFromWholeGeoJson(routeDTO.getGeoJson()));
        Track track = new Track();
        track.setGeometry(geometry);
        trackRepository.save(track);

        return RoutePlan.builder()
            .createdBy(userRepository.findById(createdBy).orElseThrow(() -> new IllegalArgumentException("Der Nutzer wurde nicht gefunden")))
            .distanceM(routeDTO.getDistanceM())
            .durationS(routeDTO.getDurationS())
            .elevationProfile(routeUtils.extractElevationProfile(geometry))
            .name(routeDTO.getName())
            .svgPreview(routeDTO.getSvgPreview())
            .elevationGain(routeDTO.getElevationGain())
            .geoJson(routeDTO.getGeoJson())
            .track(track)
            .build();
    }
}
