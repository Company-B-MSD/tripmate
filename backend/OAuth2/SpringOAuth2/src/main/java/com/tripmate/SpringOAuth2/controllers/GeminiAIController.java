package com.tripmate.SpringOAuth2.controllers;

import com.tripmate.SpringOAuth2.models.Trip;
import com.tripmate.SpringOAuth2.services.GeminiAIService;
import com.tripmate.SpringOAuth2.services.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/ai")
public class GeminiAIController {

    private final GeminiAIService geminiAIService;
    private final TripService tripService;
    private final RestTemplate restTemplate;

    @Autowired
    public GeminiAIController(GeminiAIService geminiAIService, TripService tripService) {
        this.geminiAIService = geminiAIService;
        this.tripService = tripService;
        this.restTemplate = new RestTemplate();
    }

 

    @GetMapping("/fetch-trips")
    public ResponseEntity<Map<String, Object>> fetchTripsData() {
        try {
            // Fetch trips from the /api/trips endpoint
            ResponseEntity<Trip[]> response = restTemplate.getForEntity("http://localhost:8080/api/trips", Trip[].class);
            Trip[] tripsArray = response.getBody();
            
            Map<String, Object> result = new HashMap<>();
            result.put("trips", tripsArray);
            result.put("count", tripsArray != null ? tripsArray.length : 0);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch trips: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}