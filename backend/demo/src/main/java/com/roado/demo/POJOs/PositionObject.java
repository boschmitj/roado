package com.roado.demo.POJOs;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class PositionObject {

    private Long secondsSinceStart;
    private Double lon;
    private Double lat;
    private Double altitude;
        
}
