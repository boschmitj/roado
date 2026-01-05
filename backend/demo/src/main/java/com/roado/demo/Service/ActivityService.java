package com.roado.demo.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.roado.demo.Components.AuthenticationUtils;
import com.roado.demo.Components.RouteUtils;
import com.roado.demo.DTOs.ActivityCreatedDTO;
import com.roado.demo.DTOs.ActivityDTO;
import com.roado.demo.DTOs.ActivityDescriptionDTO;
import com.roado.demo.DTOs.ActivityTitleDTO;
import com.roado.demo.DTOs.FinishRouteDTO;
import com.roado.demo.DTOs.PositionDTO;
import com.roado.demo.DTOs.StatsDTO;
import com.roado.demo.DTOs.TimedStatsDTO;
import com.roado.demo.Model.Activity;
import com.roado.demo.Model.ActivityStats;
import com.roado.demo.Model.RoutePlan;
import com.roado.demo.Model.TimedStatsEntity;
import com.roado.demo.Model.Track;
import com.roado.demo.Repository.ActivityRepository;
import com.roado.demo.Repository.TimedStatsRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final AuthenticationUtils authUtils;
    private final RouteService routeService;
    private final RouteUtils routeUtils;
    private final TrackService trackService;
    private final RouteMatchingService routeMatchingService;
    private final ActivityStatsService activityStatsService;
    private final TimedStatsService timedStatsService;
    private final StaticMapService staticMapService;
    private final TimedStatsRepository timedStatsRepository;

    public static class ActivityWithTimedStats {
        public final Activity activity;
        public final List<TimedStatsEntity> timedStats;

        public ActivityWithTimedStats(Activity activity, List<TimedStatsEntity> timedStats) {
            this.activity = activity;
            this.timedStats = timedStats;
        }
    }

    private double[][] convertPositionObjectsToDoubleArray(List<PositionDTO> positions) {
        double[][] coordinates = new double[positions.size()][2];
        for (int i = 0; i < positions.size(); i++) {
            coordinates[i][0] = positions.get(i).getLon();
            coordinates[i][1] = positions.get(i).getLat();
        }
        return coordinates;
    }

    public ActivityWithTimedStats createBaseActivity(FinishRouteDTO finishRouteDTO, Track track, JsonNode enrichedLineStringJson) throws URISyntaxException, IOException, InterruptedException, ParseException {
        Activity activity = new Activity();
        activity.setUser(authUtils.getCurrentlyAuthenticatedUser());
        activity.setTrack(track);

        
        List<TimedStatsDTO> timedStats = finishRouteDTO.getTimedStats();
        List<PositionDTO> rawTrack = timedStats.stream().map(TimedStatsDTO::position).toList();

        LineString enrichedLineString = routeUtils.geojsonToGeometry(enrichedLineStringJson, true);

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
        // activity.setTimedStats(timedStatsEntities);


        return new ActivityWithTimedStats(activity, timedStatsEntities);
    }

    @Transactional
    public ActivityCreatedDTO finishRoute(FinishRouteDTO dto) throws URISyntaxException, IOException, InterruptedException {
        try {
            dto.getTimedStats().stream().forEach(stat -> log.info(Long.toString(stat.time())));
            List<PositionDTO> rawTrack = dto.getTimedStats().stream().map(TimedStatsDTO::position).toList();

            double[][] coordinates = convertPositionObjectsToDoubleArray(rawTrack);
            LineString trackLine = routeUtils.getRouteLine(coordinates);
            JsonNode enrichedLineString = routeService.enrichLineString3D(trackLine);
            Track track = trackService.createTrack(trackLine, enrichedLineString);

            ActivityWithTimedStats activityWithTimedStats = createBaseActivity(dto, track, enrichedLineString);
            Activity activity = activityWithTimedStats.activity;
            List<TimedStatsEntity> timedStats = activityWithTimedStats.timedStats;

            boolean matched = routeMatchingService
                    .matchesPlannedRoute(dto.getPlannedRouteId(), trackLine);

            activity.setMatchedRoute(matched);

            if (matched) {
                RoutePlan route = routeService.getRoute(dto.getPlannedRouteId());
                activity.setRoute(route);
            }

            for (TimedStatsEntity timedStatsEntity : timedStats) {
                timedStatsEntity.setActivity(activity);
            }

            activity.setTimedStats(timedStats);

            activityRepository.save(activity);
            // timedStatsRepository.saveAll(timedStats); // DIDNT WORK EITHER

            staticMapService.createImageFromLine(coordinates, activity.getId());

            return new ActivityCreatedDTO(activity.getId(), "Activity created");
        } catch (ParseException pException) {
            return null;
        }
    }

    public Object putDescription(ActivityDescriptionDTO descriptionDTO) {
        Activity activity = activityRepository.findById(descriptionDTO.activityId()).orElseThrow();
        activity.setDescription(descriptionDTO.description());
        activityRepository.save(activity);
        return new ActivityDescriptionDTO(activity.getId(), activity.getDescription());
    }

    public ActivityDTO getActivity(Long activityId) {
        Activity activity = activityRepository.findById(activityId).orElseThrow();
        List<TimedStatsDTO> timedStatsDTOs = new ArrayList<>();
        for (TimedStatsEntity timedStats : activity.getTimedStats()) {
            timedStatsDTOs.add(new TimedStatsDTO(timedStats.getTime(), new PositionDTO(timedStats.getLon(), timedStats.getLat(), timedStats.getElevation()), timedStats.getSpeed()));
        }
        StatsDTO statsDTO = new StatsDTO(activity.getActivityStats().getDistanceM(),
                                        activity.getActivityStats().getDurationS(),
                                        activity.getActivityStats().getAvgSpeed(),
                                        activity.getActivityStats().getStartedAt(),
                                        activity.getActivityStats().getEndedAt(),
                                        activity.getActivityStats().getElevationGain()
                                    );
        return new ActivityDTO(activity.getName(), timedStatsDTOs, statsDTO);
    }

    public Object putTitle(ActivityTitleDTO titleDTO) {
        Activity activity = activityRepository.findById(titleDTO.activityId()).orElseThrow();
        activity.setName(titleDTO.title());
        activityRepository.save(activity);
        return new ActivityDescriptionDTO(activity.getId(), activity.getDescription());
    }

}
