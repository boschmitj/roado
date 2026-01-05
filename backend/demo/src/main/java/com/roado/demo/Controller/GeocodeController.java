package com.roado.demo.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.GeocodeDTO;
import com.roado.demo.Service.GeocodeService;

import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/geocode")
@RequiredArgsConstructor
public class GeocodeController {

    private final GeocodeService geocodeService;

    @GetMapping("/")
    public ResponseEntity<?> getMethodName(@RequestBody GeocodeDTO geocodeDTO) {
        try {
            return ResponseEntity.ok(geocodeService.getLocations(geocodeDTO));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Something went wrong");
        }
    }
    
}
