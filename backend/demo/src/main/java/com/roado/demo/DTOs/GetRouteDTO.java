package com.roado.demo.DTOs;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GetRouteDTO {
    private Long id;
    private String name;
    private JsonNode geojson;
    private Long distanceM;
    private Double[] elevationProfile;
    private Long durationS;
    private String svgPreview;
    private Long elevationGain;
}
