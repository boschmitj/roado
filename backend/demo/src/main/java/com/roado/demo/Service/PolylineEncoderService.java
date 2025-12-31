package com.roado.demo.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.google.maps.internal.PolylineEncoding;
import com.google.maps.model.LatLng;

@Service
public class PolylineEncoderService {

    public String encodePolylineFromPoints(double[][] coordinateArray) {
        List<LatLng> coords = new ArrayList<>();
        for (int i = 0; i < coordinateArray.length; i++) {
            coords.add(new LatLng(coordinateArray[i][1], coordinateArray[i][0]));
        }

        return PolylineEncoding.encode(coords);
    }
}
