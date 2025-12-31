package com.roado.demo.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.CoordinateDTO;
import com.roado.demo.Service.StaticMapService;

import jakarta.websocket.server.PathParam;

import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/staticmap")
public class StaticMapController {

    private final StaticMapService staticMapService;

    public StaticMapController(StaticMapService staticMapService) {
        this.staticMapService = staticMapService;
    }

    @PostMapping("/createImage/{id}")
    public ResponseEntity<?> createImageFromLine(@PathVariable("id") Long id, @RequestBody CoordinateDTO coordinateDTO) {
        return staticMapService.createImageFromLine(coordinateDTO, id);
    }

    @GetMapping("/getImage/{id}")
    public ResponseEntity<Resource> getImage(@PathVariable("id") Long id) throws IOException {
        Resource image = staticMapService.getImage(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + id + ".png\"")
            .contentType(MediaType.IMAGE_PNG)
            .body(image);
    }
    
    // now need to create the route image after the route is finished (remember finishRouteDTO)
    
}
