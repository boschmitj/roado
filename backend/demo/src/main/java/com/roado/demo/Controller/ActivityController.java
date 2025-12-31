package com.roado.demo.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.ActivityCreatedDTO;
import com.roado.demo.DTOs.ActivityDescriptionDTO;
import com.roado.demo.DTOs.ActivityTitleDTO;
import com.roado.demo.DTOs.FinishRouteDTO;
import com.roado.demo.Service.ActivityService;

import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
@Slf4j
public class ActivityController {

    private final ActivityService activityService;
    @PostMapping("/{id}/finish")
    public ResponseEntity<ActivityCreatedDTO> finishRoute(@PathVariable Long id, @Validated @RequestBody FinishRouteDTO finishRouteDTO) {
        // need to create a route from the coords first and then a activity which points to the route (or vice versa)
        
        if (finishRouteDTO == null) return ResponseEntity.badRequest().build();
        log.info(finishRouteDTO.toString());
        try {
            ActivityCreatedDTO activityCreatedDTO = activityService.finishRoute(finishRouteDTO);
            if (activityCreatedDTO == null) return ResponseEntity.badRequest().build();
            return ResponseEntity.ok(activityCreatedDTO);
        } catch (URISyntaxException | IOException | InterruptedException e) {
            return ResponseEntity.badRequest().build();
        }
        
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivity(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(activityService.getActivity(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body("The activity could not be found");
        }
    }
    

    @PutMapping("/description")
    public ResponseEntity<?> putMethodName(@RequestBody ActivityDescriptionDTO descriptionDTO) {
        try {
            return ResponseEntity.ok(activityService.putDescription(descriptionDTO));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body("The activity could not be found");
        }
    }

    @PutMapping("/title")
    public ResponseEntity<?> putMethodName(@RequestBody ActivityTitleDTO titleDTO) {
        try {
            return ResponseEntity.ok(activityService.putTitle(titleDTO));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body("The activity could not be found");  
        }
    }
    
}
