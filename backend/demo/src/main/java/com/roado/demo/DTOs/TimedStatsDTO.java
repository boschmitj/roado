package com.roado.demo.DTOs;

public record TimedStatsDTO(
    Long time,
    PositionDTO position,
    Double speed
) {}
