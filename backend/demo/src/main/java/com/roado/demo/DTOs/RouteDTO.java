package com.roado.demo.DTOs;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RouteDTO {
    private String name;
    private String geoData;
    private Long distanceM;
    private String elevationProfile;
    private Long durationS;
    private String svgPreview;
    private Long elevationGain;
}
