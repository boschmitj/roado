package com.roado.demo.Service;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import com.roado.demo.Components.RouteUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RouteMatchingService {

    private final RouteUtils routeUtils;

    public boolean matchesPlannedRoute(Long plannedRouteId, LineString trackLine) throws ParseException {
        return (!routeUtils.usedOriginalRoute(plannedRouteId, trackLine));
    }

}
