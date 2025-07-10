package com.tripmate.SpringOAuth2.controllers;

import com.tripmate.SpringOAuth2.models.TripRequest;
import com.tripmate.SpringOAuth2.models.TripResponse;
import com.tripmate.SpringOAuth2.services.TripPlannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trip")
public class TripPlannerController {
    @Autowired
    private TripPlannerService tripPlannerService;

    @PostMapping("/plan")
    public ResponseEntity<TripResponse> generateTrip(@RequestBody TripRequest request) {
        try {
            TripResponse response = tripPlannerService.planTrip(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new TripResponse("Error generating trip plan: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Trip Planner Service is running");
    }
}