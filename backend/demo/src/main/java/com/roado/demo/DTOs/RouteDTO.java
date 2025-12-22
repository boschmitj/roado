package com.roado.demo.DTOs;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RouteDTO {
    private String name;
    private JsonNode geoJson;
    private Long distanceM;
    private Long durationS;
    private String svgPreview;
    private Long elevationGain;
}
