package com.roado.demo.DTOs;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class StatsDTO {
    Double totalDistance;
    Long totalTime;
    Double totalElevation;
    Double avgSpeed;
    
    LocalDateTime startDate;
    LocalDateTime endDate;

}
