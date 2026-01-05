package com.roado.demo.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.List;

import org.apache.tomcat.util.json.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.roado.demo.DTOs.GeocodeDTO;
import com.roado.demo.DTOs.LocationDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GeocodeService {

    @Value("${OPENROUTESEVICES_API_KEY}")
    private String OPENROUTESERVICES_API_KEY;

    public List<LocationDTO> getLocations(GeocodeDTO geocodeDTO) throws URISyntaxException, IOException, InterruptedException, ParseException {
        HttpClient client = HttpClient.newHttpClient();
        String url = "https://api.openrouteservice.org/geocode/search?apiKey=" + OPENROUTESERVICES_API_KEY 
            + "&text=" + geocodeDTO.query() + "&focus.point.lon=" + geocodeDTO.positionDTO().getLon() + "&focus.point.lat=" + geocodeDTO.positionDTO().getLat();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI(url))
            .GET()
            .header("Content-Type", "application/json")
            .build();
        
        HttpResponse<String> response = client.send(request, BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP error " + response.statusCode() + ": " + response.body());
        }

        return LocationDTO.parse(response.body());
        
    }



}
