package com.roado.demo.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetRouteWithCenterDTO extends GetRouteDTO {

    private double[] center;

    public GetRouteWithCenterDTO(Long id, String name, Long distanceM, String geoJson, Double[] elevationProfile,
            Long durationS, Long elevationGain, String trackImageUrl, double[] startPoint, double[] center) {
        super(id, name, distanceM, geoJson, elevationProfile, durationS, elevationGain, trackImageUrl, startPoint);
        this.center = center;
    }
}
