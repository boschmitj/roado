package com.roado.demo.DTOs;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class StatsDTO {
    Double totalDistance;
    Long totalDuration;
    Double avgSpeed;
    LocalDateTime startDate;
    LocalDateTime endDate;
}
