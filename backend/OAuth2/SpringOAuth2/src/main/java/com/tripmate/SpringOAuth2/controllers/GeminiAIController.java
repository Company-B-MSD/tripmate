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

    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getAIInsights() {
        try {
            // Get all trips from the trip service
            List<Trip> trips = tripService.getAllTrips();
            
            Map<String, Object> response = new HashMap<>();
            
            // If there are no trips, return a message
            if (trips == null || trips.isEmpty()) {
                response.put("message", "No trips found. Create a trip to get AI insights.");
                response.put("tripCount", 0);
                return ResponseEntity.ok(response);
            }
            
            // If there are trips, get AI analysis
            CompletableFuture<String> analysisFuture = geminiAIService.analyzeTripData(trips);
            String analysis = analysisFuture.get(); // This will block until the future completes
            
            response.put("analysis", analysis);
            response.put("tripCount", trips.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to generate AI insights: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @GetMapping("/recommendations/{tripIndex}")
    public ResponseEntity<Map<String, Object>> getTripRecommendations(@PathVariable int tripIndex) {
        try {
            List<Trip> trips = tripService.getAllTrips();
            if (tripIndex < 0 || tripIndex >= trips.size()) {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid trip index")
                );
            }
            
            Trip trip = trips.get(tripIndex);
            CompletableFuture<String> recommendationsFuture = geminiAIService.getTravelRecommendations(trip);
            String recommendations = recommendationsFuture.get();
            
            return ResponseEntity.ok(Map.of("recommendations", recommendations));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("error", "Failed to generate recommendations: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/itinerary/{tripIndex}")
    public ResponseEntity<Map<String, Object>> getTripItinerary(@PathVariable int tripIndex) {
        try {
            List<Trip> trips = tripService.getAllTrips();
            if (tripIndex < 0 || tripIndex >= trips.size()) {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid trip index")
                );
            }
            
            Trip trip = trips.get(tripIndex);
            CompletableFuture<String> itineraryFuture = geminiAIService.generateItinerary(trip);
            String itinerary = itineraryFuture.get();
            
            return ResponseEntity.ok(Map.of("itinerary", itinerary));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("error", "Failed to generate itinerary: " + e.getMessage())
            );
        }
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