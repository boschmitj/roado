package com.roado.demo.DTOs;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class StatsDTO {
    Double totalDistance;
    Long foregroundTime;
    Long backgroundTime;
    Double avgSpeed;
    Double[] speedList;
    
    LocalDateTime startDate;
    LocalDateTime endDate;

}
