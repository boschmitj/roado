package com.roado.demo.DTOs;
import com.roado.demo.POJOs.PositionObject;

import lombok.Data;

@Data
public class FinishRouteDTO {
    
    private Long plannedRouteId;
    private PositionObject[] rawTrack;
    private StatsDTO stats;
    
}
