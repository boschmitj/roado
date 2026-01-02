package com.roado.demo.DTOs;

import java.util.ArrayList;
import java.util.List;

import org.apache.tomcat.util.json.ParseException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public record LocationDTO(
    double latitude,
    double longitude,
    String text
) {

    public static List<LocationDTO> parse(String body) throws ParseException, JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<LocationDTO> locations = new ArrayList<>();
        
        JsonNode json = objectMapper.readTree(body);
        JsonNode features = json.get("features");
        if (!features.isArray()) {
            throw new ParseException("Features is not an array");
        }

        for (int i = 0; i < features.size(); i++) {
            JsonNode feature = features.get(i);
            JsonNode geometry = feature.get("geometry");
            if (!geometry.isObject()) {
                throw new ParseException("Geometry is not an object");
            }
            JsonNode coordinates = geometry.get("coordinates");
            if (!coordinates.isArray()) {
                throw new ParseException("Coordinates is not an array");
            }
            double latitude = coordinates.get(1).asDouble();
            double longitude = coordinates.get(0).asDouble();
            String locality = feature.get("properties").get("locality").asText();
            locations.add(new LocationDTO(latitude, longitude, locality));
        }
        return locations;
        
    }

}
