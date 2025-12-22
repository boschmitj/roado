package com.roado.demo.Service;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import com.roado.demo.Components.AuthenticationUtils;
import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.FinishRouteDTO;
import com.roado.demo.Model.Activity;
import com.roado.demo.Model.ActivityStats;
import com.roado.demo.Model.RoutePlan;
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

    public Activity createBaseActivity(FinishRouteDTO finishRouteDTO, Track track) {
        Activity activity = new Activity();
        activity.setUser(authUtils.getCurrentlyAuthenticatedUser());
        activity.setTrack(track);

        ActivityStats activityStats = new ActivityStats();
        
        activityStats.setDistanceM(finishRouteDTO.getStats().getTotalDistance());
        activityStats.setDurationS(finishRouteDTO.getStats().getTotalTime());
        activityStats.setStartedAt(finishRouteDTO.getStats().getStartDate());
        activityStats.setEndedAt(finishRouteDTO.getStats().getEndDate());
        activityStats.setElevationGain(finishRouteDTO.getStats().getTotalElevation());
        activityStats.setAvgSpeed(finishRouteDTO.getStats().getAvgSpeed());

        activity.setActivityStats(activityStats);

        return activity;
    }

    @Transactional
    public void finishRoute(FinishRouteDTO dto) {
        try {
            LineString trackLine = routeUtils.getRouteLine(dto.getRawTrack());
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
