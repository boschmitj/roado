package com.roado.demo.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.roado.demo.DTOs.FinishRouteDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/activity")
public class ActivityController {

    @PostMapping("/id/finish")
    public ResponseEntity<?> finishRoute(@RequestParam Long id, @RequestBody FinishRouteDTO finishRouteDTO) {
        // need to create a route from the coords first and then a activity which points to the route (or vice versa)
        if (finishRouteDTO == null) return ResponseEntity.badRequest().build();
        if () {
            // need to create a new route from the coords first and then a activity which points to the route
        } else {

        }


        return ResponseEntity.ok().build();
        
    }
    
}
