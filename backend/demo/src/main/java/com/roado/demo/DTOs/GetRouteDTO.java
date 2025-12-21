package com.roado.demo.DTOs;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GetRouteDTO {
    private Long id;
    private String name;
    private String geoData;
    private Long distanceM;
    private Double[] elevationProfile;
    private Long durationS;
    private String svgPreview;
    private Long elevationGain;
}
