package com.roado.demo.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PositionDTO {

    private Double lon;
    private Double lat;
    private Double altitude;
 
    public PositionDTO(Double lon, Double lat, Double altitude) {
        this.lon = lon;
        this.lat = lat;
        this.altitude = altitude;
    }

    public PositionDTO(Double lon, Double lat) {
        this.lon = lon;
        this.lat = lat;
        this.altitude = null;
    }

}
