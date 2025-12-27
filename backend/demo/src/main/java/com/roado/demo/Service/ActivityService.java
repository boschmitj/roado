package com.roado.demo.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import com.roado.demo.Components.AuthenticationUtils;
import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.FinishRouteDTO;
import com.roado.demo.DTOs.PositionDTO;
import com.roado.demo.DTOs.TimedStatsDTO;
import com.roado.demo.Model.Activity;
import com.roado.demo.Model.ActivityStats;
import com.roado.demo.Model.RoutePlan;
import com.roado.demo.Model.TimedStatsEntity;
import com.roado.demo.Model.Track;
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

    private double[][] convertPositionObjectsToDoubleArray(List<PositionDTO> positions) {
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

        
        List<TimedStatsDTO> timedStats = finishRouteDTO.getTimedStats();
        List<PositionDTO> rawTrack = timedStats.stream().map(TimedStatsDTO::position).toList();

        LineString linestring = routeUtils.getRouteLine(routeUtils.toArray(rawTrack));
        LineString enrichedLineString = routeUtils.geojsonToGeometry(routeService.enrichLineString3D(linestring));

        List<PositionDTO> positions = routeUtils.addAltitude(rawTrack, enrichedLineString);

        // because no new positions are created, the positions can be merged with the timedStats
        List<TimedStatsDTO> positions3DWithTime = new ArrayList<>();
        for (int i = 0; i < timedStats.size(); i++) {
            PositionDTO position = positions.get(i);
            positions3DWithTime.add(new TimedStatsDTO(timedStats.get(i).time(), position, timedStats.get(i).speed()));
        }

        ActivityStats activityStats = activityStatsService.createActivityStats(finishRouteDTO, routeService.computeElevationGain(enrichedLineString));
        List<TimedStatsEntity> timedStatsEntities = timedStatsService.createTimedStatsEntity(positions3DWithTime); // FIXME: Need to fit the NEW 3D positions and the timedStats into one just like the TimedStatsDTO so that seconds since start is in one

        activity.setActivityStats(activityStats);
        activity.setTimedStats(timedStatsEntities);

        return activity;
    }

    @Transactional
    public void finishRoute(FinishRouteDTO dto) throws URISyntaxException, IOException, InterruptedException {
        try {
            List<PositionDTO> rawTrack = dto.getTimedStats().stream().map(TimedStatsDTO::position).toList();

            double[][] coordinates = convertPositionObjectsToDoubleArray(rawTrack);
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
