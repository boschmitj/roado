package com.roado.demo.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.CoordinateDTO;
import com.roado.demo.Service.StaticMapService;

import jakarta.websocket.server.PathParam;

import java.io.FileNotFoundException;
import java.io.IOException;

import javax.print.attribute.standard.Media;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/staticmap")
public class StaticMapController {

    private final StaticMapService staticMapService;

    public StaticMapController(StaticMapService staticMapService) {
        this.staticMapService = staticMapService;
    }

    @PostMapping("/createImage/{id}")
    public ResponseEntity<?> createImageFromLine(@PathVariable("id") Long activityId, @RequestBody CoordinateDTO coordinateDTO) {
        return staticMapService.createImageFromLine(coordinateDTO, staticMapService.getTrackIdFromActivityId(activityId));
    }

    @GetMapping(value="/getImage/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<?> getImage(@PathVariable("id") Long activityId) throws IOException {
        Long trackId = staticMapService.getTrackIdFromActivityId(activityId);
        try {
            Resource image = staticMapService.getImage(trackId);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + trackId + ".png\"")
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
        } catch (FileNotFoundException fnfE) {
            return ResponseEntity.status(404).body("Image for id " + trackId + " not found");
        }
    }

    @GetMapping(value = "/getImageTrack/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<?> getImageGivenTrackId(@PathVariable("id") Long trackId) throws IOException {
        try {
            Resource image = staticMapService.getImage(trackId);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + trackId + ".png\"")
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
        } catch (FileNotFoundException fnfE) {
            return ResponseEntity.status(404).body("Image for id " + trackId + " not found");
        }
        
    }
    
        
}
