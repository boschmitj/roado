package com.roado.demo.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import com.roado.demo.Components.AuthenticationUtils;
import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.FinishRouteDTO;
import com.roado.demo.Model.Activity;
import com.roado.demo.Model.ActivityStats;
import com.roado.demo.Model.RoutePlan;
import com.roado.demo.Model.TimedStatsEntity;
import com.roado.demo.Model.Track;
import com.roado.demo.POJOs.PositionObject;
import com.roado.demo.Repository.ActivityRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final AuthenticationUtils authUtils;
    private final RouteService routeService;
    private final RouteUtils routeUtils;
    private final TrackService trackService;
    private final RouteMatchingService routeMatchingService;
    private final ActivityStatsService activityStatsService;
    private final TimedStatsService timedStatsService;

    private double[][] convertPositionObjectsToDoubleArray(List<PositionObject> positions) {
        double[][] coordinates = new double[positions.size()][2];
        for (int i = 0; i < positions.size(); i++) {
            coordinates[i][0] = positions.get(i).getLon();
            coordinates[i][1] = positions.get(i).getLat();
        }
        return coordinates;
    }

    public Activity createBaseActivity(FinishRouteDTO finishRouteDTO, Track track) throws URISyntaxException, IOException, InterruptedException, ParseException {
        Activity activity = new Activity();
        activity.setUser(authUtils.getCurrentlyAuthenticatedUser());
        activity.setTrack(track);

        LineString linestring = routeUtils.getRouteLine(routeUtils.toArray(finishRouteDTO.getRawTrack()));
        LineString enrichedLineString = routeUtils.geojsonToGeometry(routeService.enrichLineString3D(linestring));
        List<PositionObject> positions = routeUtils.addAltitude(finishRouteDTO.getRawTrack(), enrichedLineString);

        ActivityStats activityStats = activityStatsService.createActivityStats(finishRouteDTO, routeService.computeElevationGain(enrichedLineString));
        List<TimedStatsEntity> timedStatsEntities = timedStatsService.createTimedStatsEntity(positions, finishRouteDTO.getStats().getSpeedList());

        activity.setActivityStats(activityStats);
        activity.setTimedStats(timedStatsEntities);

        return activity;
    }

    @Transactional
    public void finishRoute(FinishRouteDTO dto) throws URISyntaxException, IOException, InterruptedException {
        try {
            double[][] coordinates = convertPositionObjectsToDoubleArray(dto.getRawTrack());
            LineString trackLine = routeUtils.getRouteLine(coordinates);
            Track track = trackService.createTrack(trackLine);

            Activity activity = createBaseActivity(dto, track);

            boolean matched = routeMatchingService
                    .matchesPlannedRoute(dto.getPlannedRouteId(), trackLine);

            activity.setMatchedRoute(matched);

            if (matched) {
                RoutePlan route = routeService.getRoute(dto.getPlannedRouteId());
                activity.setRoute(route);
            }

            activityRepository.save(activity);
        } catch (ParseException pException) {
            // TODO: handle E
        }
    }

}
