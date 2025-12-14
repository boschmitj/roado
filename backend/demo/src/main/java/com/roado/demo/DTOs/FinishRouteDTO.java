package com.roado.demo.DTOs;

import lombok.Data;

@Data
public class FinishRouteDTO {

    private Long routeId;
    private Double[][] coordinates;
    private Long distanceM;
    private Long durationS;
    private Double avgSpeed;
}
