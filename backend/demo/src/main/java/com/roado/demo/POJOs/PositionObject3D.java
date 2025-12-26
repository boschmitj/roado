package com.roado.demo.POJOs;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PositionObject3D extends PositionObject2D {

    private Double altitude;
        
    public PositionObject3D(Double lon, Double lat, Double altitude) {
        super(lon, lat);
        this.altitude = altitude;
    }
}
