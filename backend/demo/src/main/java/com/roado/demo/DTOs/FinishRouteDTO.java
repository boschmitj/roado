package com.roado.demo.DTOs;
import java.util.List;

import com.roado.demo.POJOs.PositionObject;

import lombok.Data;

@Data
public class FinishRouteDTO {
    
    private Long plannedRouteId;
    private List<PositionObject> rawTrack;
    private StatsDTO stats;
    
}
