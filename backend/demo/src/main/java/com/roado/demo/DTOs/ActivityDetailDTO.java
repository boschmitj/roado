package com.roado.demo.DTOs;

import java.util.List;

public record ActivityDetailDTO(
    Long id,
    String name,
    UserDTO user,
    ActivityStatsDTO activityStats,
    PlannedRouteRefDTO basedOnRoute,
    TrackDTO track,
    
    List<TimedStatsDTO> timedStats
) {}
