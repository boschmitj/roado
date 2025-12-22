package com.roado.demo.DTOs;
import lombok.Data;

@Data
public class FinishRouteDTO {
    
    private Long plannedRouteId;
    private double[][] rawTrack;
    private StatsDTO stats;
    
}
