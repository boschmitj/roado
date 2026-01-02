package com.roado.demo.DTOs;

import java.time.LocalDateTime;

public record ActivityStatsDTO(
    Long id,
    Double distanceM,
    Long durationS,
    LocalDateTime startedAt,
    LocalDateTime endedAt,
    Double elevationGain,
    Double avgSpeed
) {}
