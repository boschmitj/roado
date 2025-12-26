package com.roado.demo.DTOs;
import java.util.List;


import lombok.Data;

@Data
public class FinishRouteDTO {
    
    private Long plannedRouteId;
    private List<TimedStatsDTO> timedStats;
    private StatsDTO stats;
    
}
