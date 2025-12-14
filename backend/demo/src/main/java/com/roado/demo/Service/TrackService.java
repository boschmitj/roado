package com.roado.demo.Service;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import com.roado.demo.Components.RouteUtils;
import com.roado.demo.Model.Track;
import com.roado.demo.Repository.TrackRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrackService {
    
    private final TrackRepository trackRepository;
    private final RouteUtils routeUtils;

    public Track createTrack(LineString route) throws ParseException {
        Track track = new Track();
        track.setGeometry(route);
        track.setGeometrySimplified(routeUtils.simplify(route));

        return trackRepository.save(track);
    }

}
