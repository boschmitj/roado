package com.roado.demo.DTOs;

import java.util.List;

public class CoordinateDTO {

    private List<List<Double>> coordinates;
    private Boolean elevation;

    public Boolean getElevation() {
        return elevation;
    }



    public void setElevation(Boolean elevation) {
        this.elevation = elevation;
    }



    public List<List<Double>> getCoordinates() {
        return coordinates;
    }

    

    public void setCoordinates(List<List<Double>> coordinates) {
        this.coordinates = coordinates;
    }
    
}
