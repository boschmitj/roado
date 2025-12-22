package com.roado.demo.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.FinishRouteDTO;
import com.roado.demo.Service.ActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
@Slf4j
public class ActivityController {

    private final ActivityService activityService;
    @PostMapping("/{id}/finish")
    public ResponseEntity<?> finishRoute(@PathVariable Long id, @Validated @RequestBody FinishRouteDTO finishRouteDTO) {
        // need to create a route from the coords first and then a activity which points to the route (or vice versa)
        
        if (finishRouteDTO == null) return ResponseEntity.badRequest().build();
        log.info(finishRouteDTO.toString());
        try {
            activityService.finishRoute(finishRouteDTO);
        } catch (URISyntaxException | IOException | InterruptedException e) {
            return ResponseEntity.badRequest().body("Something went wrong");
        }
        
        return ResponseEntity.ok().build();
        
    }
    
}
