package com.roado.demo.DTOs;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GetRouteDTO {
    private Long id;
    private String name;
    private Long distanceM;
    private Double[] elevationProfile; // TODO: maybe remove this field as it currently is not used
    private Long durationS;
    private String svgPreview;
    private Long elevationGain;
    private String trackImageUrl;
}
