package com.roado.demo.POJOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PositionObject2D {
    private Double lon;
    private Double lat;

    public PositionObject2D(Double lon, Double lat) {
        this.lon = lon;
        this.lat = lat;
    }
}
