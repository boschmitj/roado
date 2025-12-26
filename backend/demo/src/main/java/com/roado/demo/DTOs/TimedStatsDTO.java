package com.roado.demo.DTOs;

import com.roado.demo.POJOs.PositionObject2D;

public record TimedStatsDTO(
    Long time,
    PositionObject2D position,
    Double speed
) {}
