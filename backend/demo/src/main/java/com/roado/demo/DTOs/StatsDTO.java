package com.roado.demo.DTOs;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatsDTO {
    Double totalDistance;
    Long totalDuration;
    Double avgSpeed;
    LocalDateTime startDate;
    LocalDateTime endDate;
    Double elevationGain;
}
