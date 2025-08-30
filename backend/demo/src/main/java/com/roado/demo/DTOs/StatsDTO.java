package com.roado.demo.DTOs;

import java.time.Duration;
import java.time.LocalDate;

import lombok.Data;

@Data
public class StatsDTO {
    Double totalDistance;
    Duration totalTime;
    Double totalElevation;
    Integer activityCount;
    LocalDate startDate;
    LocalDate endDate;
}
