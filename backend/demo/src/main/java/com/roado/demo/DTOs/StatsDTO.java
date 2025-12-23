package com.roado.demo.DTOs;

import java.time.LocalDateTime;
import java.util.List;

import com.roado.demo.POJOs.SpeedObject;

import lombok.Data;

@Data
public class StatsDTO {
    Double totalDistance;
    Long foregroundTime;
    Long backgroundTime;
    Double avgSpeed;
    List<SpeedObject> speedList;
    
    LocalDateTime startDate;
    LocalDateTime endDate;

}
