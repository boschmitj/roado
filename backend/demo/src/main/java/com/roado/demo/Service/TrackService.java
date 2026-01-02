package com.roado.demo.Service;

import java.io.IOException;
import java.net.URISyntaxException;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roado.demo.Components.RouteUtils;
import com.roado.demo.Model.Track;
import com.roado.demo.Repository.TrackRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrackService {
    
    private final TrackRepository trackRepository;
    private final RouteUtils routeUtils;
    private ObjectMapper objectMapper;

    public Track createTrack(LineString route, JsonNode enrichedLineString) throws ParseException, URISyntaxException, IOException, InterruptedException {
        objectMapper = new ObjectMapper();
        Track track = new Track();
        if (!route.hasDimension(3)) {
            double[][] enrichedCoordsArray3D = objectMapper.treeToValue(enrichedLineString, double[][].class);
            LineString enrichedRouteLine3D = routeUtils.getRouteLine(enrichedCoordsArray3D);
            track.setGeometry(enrichedRouteLine3D);
            track.setGeometrySimplified(routeUtils.simplify(enrichedRouteLine3D));
        } else {
            track.setGeometry(route);
            track.setGeometrySimplified(routeUtils.simplify(route));
        }
        

        return trackRepository.save(track);
    }

}
