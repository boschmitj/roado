package com.roado.demo.DTOs;

import org.locationtech.jts.geom.Coordinate;

import lombok.Data;

@Data
public class FinishRouteDTO {
    
    private Long plannedRouteId;
    private Coordinate[] rawTrack;
    private StatsDTO stats;
    
}
