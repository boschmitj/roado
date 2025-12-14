package com.roado.demo.Service;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.proc.SecurityContext;
import com.roado.demo.Components.AuthenticationUtils;
import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.FinishRouteDTO;
import com.roado.demo.Model.Activity;
import com.roado.demo.Model.Route;
import com.roado.demo.Model.Track;
import com.roado.demo.Repository.ActivityRepository;
import com.roado.demo.Repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final AuthenticationUtils authUtils;
    private final RouteService routeService;
    private final RouteUtils routeUtils;
    private final ActivityService activityService;
    private final TrackService trackService;
    private final RouteMatchingService routeMatchingService;

    public Activity createBaseActivity(FinishRouteDTO finishRouteDTO, Track track) {
        Activity activity = new Activity();
        activity.setUser(authUtils.getCurrentlyAuthenticatedUser());
        activity.setTrack(track);
        activity.setDistanceM(finishRouteDTO.getStats().getTotalDistance());
        activity.setDurationS(finishRouteDTO.getStats().getTotalTime());
        activity.setStartedAt(finishRouteDTO.getStats().getStartDate());
        activity.setEndedAt(finishRouteDTO.getStats().getEndDate());
        activity.setElevationGain(finishRouteDTO.getStats().getTotalElevation());
        activity.setAvgSpeed(finishRouteDTO.getStats().getAvgSpeed());

        return activity;
    }

    @Transactional
    public void finishRoute(FinishRouteDTO dto) {
        try {
            LineString trackLine = routeUtils.getRouteLine(dto.getRawTrack());
            Track track = trackService.createTrack(trackLine);

            Activity activity = activityService.createBaseActivity(dto, track);

            boolean matched = routeMatchingService
                    .matchesPlannedRoute(dto.getPlannedRouteId(), trackLine);

            activity.setMatchedRoute(matched);

            if (matched) {
                Route route = routeService.getRoute(dto.getPlannedRouteId());
                activity.setRoute(route);
            }


            activityRepository.save(activity);
        } catch (ParseException pException) {
            // TODO: handle E
        }
    }

}
