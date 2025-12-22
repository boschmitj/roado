package com.roado.demo.Service;

import java.io.IOException;
import java.net.URISyntaxException;

import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.FinishRouteDTO;
import com.roado.demo.Model.ActivityStats;
import com.roado.demo.Repository.ActivityStatsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivityStatsService {

    private final RouteService routeService;
    private final RouteUtils routeUtils;
    private final ActivityStatsRepository activityStatsRepository;

    public ActivityStats createActivityStats(FinishRouteDTO finishRouteDTO) throws URISyntaxException, IOException, InterruptedException, ParseException {
        ActivityStats activityStats = new ActivityStats();
        activityStats.setDistanceM(finishRouteDTO.getStats().getTotalDistance());
        activityStats.setDurationS(finishRouteDTO.getStats().getForegroundTime());
        activityStats.setStartedAt(finishRouteDTO.getStats().getStartDate());
        activityStats.setEndedAt(finishRouteDTO.getStats().getEndDate());
        activityStats.setElevationGain(routeService.computeElevationGain(routeUtils.getRouteLine(finishRouteDTO.getRawTrack())));
        activityStats.setAvgSpeed(finishRouteDTO.getStats().getAvgSpeed());

        return activityStatsRepository.save(activityStats);
    }
}
