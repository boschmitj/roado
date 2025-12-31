package com.roado.demo.DTOs;

import java.util.List;

public record ActivityDTO(
    String name,
    List<TimedStatsDTO> timedStats,
    StatsDTO stats
) {
} 
