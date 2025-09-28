package com.roado.demo.DTOs;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RouteDTO {
    private Long routeId;
    private Long createdBy;
    private String name;
    private String geoData;
    private Long distanceM;
    private String elevationProfile;
}
