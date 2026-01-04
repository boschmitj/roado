package com.roado.demo.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roado.demo.DTOs.CoordinateDTO;
import com.roado.demo.Repository.ActivityRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StaticMapService {

    @Value("${GEOAPIFY_API_KEY}")
    private String apiKey;

    @Value("${generated.images.path:generated-images}")
    private String generatedImagesPath;

    ObjectMapper mapper;

    private final PolylineEncoderService polylineEncoderService;
    private final ActivityRepository activityRepository;
    
    public StaticMapService(ObjectMapper mapper, 
            PolylineEncoderService polylineEncoderService, 
            ActivityRepository activityRepository) {
        this.polylineEncoderService = polylineEncoderService;
        this.mapper = new ObjectMapper();
        this.activityRepository = activityRepository;
    }

    
    public ResponseEntity<?> createImageFromLine(double[][] coords, Long trackId) {
        Path folder = Path.of(generatedImagesPath);
        try {
            Files.createDirectories(folder);
            Path outputFile = folder.resolve(trackId + ".png");
            log.info("Creating image at: " + outputFile.toAbsolutePath());
            String base = "https://maps.geoapify.com/v1/staticmap?apiKey=" + apiKey;
            String body = buildRequestBody(coords);
            log.info("Request body: " + body);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest.BodyPublisher bodyPublisher = HttpRequest.BodyPublishers.ofString(body);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI(base))
                .header("Content-Type", "application/json")
                .POST(bodyPublisher)
                .build();

            HttpResponse<byte[]> response = client.send(request, BodyHandlers.ofByteArray());

            if (response.statusCode() == 200) {
                log.info("Request successful");
                log.info(response.body().length + " bytes returned");
                log.info("Trying to write response to " + outputFile.toFile());
                log.info("Writing image to: {}", outputFile.toAbsolutePath());
                Files.createDirectories(outputFile.getParent());
                try (FileOutputStream out = new FileOutputStream(outputFile.toFile())) {
                    out.write(response.body());
                }
                return ResponseEntity.ok().header("Content-Type", "image/png").body(response.body());
            } else {
                log.info("Geoapify API error: HTTP " + response.statusCode() + " - " + new String(response.body()));
                String err = "Geoapify API error: HTTP " + response.statusCode() + " - " + new String(response.body());
                return ResponseEntity.status(500).body(err);
            }
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body("Failed to build request body: " + e.getMessage());
        } catch (URISyntaxException e) {
            return ResponseEntity.status(500).body("Invalid Geoapify URI: " + e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("I/O error while creating map: " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(500).body("Request interrupted");
        }
    }


    public Long getTrackIdFromActivityId(Long activityId) {
        return activityRepository.findById(activityId).orElseThrow().getTrack().getId();
    }

    public ResponseEntity<?> createImageFromLine(CoordinateDTO coordinateDTO, Long trackId) {

        double[][] coords = new double[coordinateDTO.getCoordinates().size()][];
        for (int i = 0; i < coordinateDTO.getCoordinates().size(); i++) {
            coords[i][0] = coordinateDTO.getCoordinates().get(i).get(0);
            coords[i][1] = coordinateDTO.getCoordinates().get(i).get(1);
        }
        
        return createImageFromLine(coords, trackId);
    }

    private String buildRequestBody(double[][] coords) throws JsonProcessingException {

        // boolean sendEncoded = coords.length > 30;
        boolean sendEncoded = true;
        List<Map<String,Double>> valueList = getPolylineValue(coords);
        
        Map<String, Object> geometry = Map.of(
            "type", sendEncoded ? "polyline5" : "polyline",
            "linecolor", "#334524",
            "linewidth", 3,
            "value", sendEncoded ? polylineEncoderService.encodePolylineFromPoints(coords) : valueList
        );

        List<Map<String, Object>> geometries = List.of(geometry);

        Map<String, Object> bodyMap = Map.of(
            "style", "positron",
            "scaleFactor", 2,
            "lang", "uk",
            "width", 800,
            "height", 600,
            "geometries", geometries
        );


        return mapper.writeValueAsString(bodyMap);
        
}

    private List<Map<String, Double>> getPolylineValue(CoordinateDTO coordinateDTO) {
        List<Map<String, Double>> valueList = coordinateDTO.getCoordinates().stream()
            .map(pos -> Map.of("lat", pos.get(0), "lon", pos.get(1)))
            .toList();
        return valueList;
    }

    private List<Map<String, Double>> getPolylineValue(double[][] coords) {
        List<Map<String, Double>> valueList = new ArrayList<>();
        for (int i = 0; i < coords.length; i++) {
            valueList.add(Map.of("lat", coords[i][1], "lon", coords[i][0]));
        }
        return valueList;
    }

    public Resource getImage(Long id) throws IOException {
        Path imagePath = Path.of(generatedImagesPath).resolve(id + ".png");
        log.info("Looking for image at: " + imagePath.toAbsolutePath());

        if (!Files.exists(imagePath) || !Files.isReadable(imagePath)) {
            throw new FileNotFoundException("Image not found: " + id);
        }
        try {
            return new UrlResource(imagePath.toUri());
        } catch (MalformedURLException e) {
            throw new IOException("Invalid file path for image: " + id, e);
        }
    }

}
