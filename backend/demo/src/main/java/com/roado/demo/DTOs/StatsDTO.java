package com.roado.demo.DTOs;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatsDTO {
    Double totalDistance;
    Long totalDuration;
    Double avgSpeed;
    ZonedDateTime startDate;
    ZonedDateTime endDate;
    Double elevationGain;
}
