package com.tripmate.SpringOAuth2.controllers;

import com.tripmate.SpringOAuth2.models.Trip;
import com.tripmate.SpringOAuth2.services.GeminiAIService;
import com.tripmate.SpringOAuth2.services.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/trips") 
public class TripController {

    private final TripService tripService;
    private final GeminiAIService geminiAIService;

    @Autowired
    public TripController(TripService tripService, GeminiAIService geminiAIService) {
        this.tripService = tripService;
        this.geminiAIService = geminiAIService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTrip(@RequestBody Trip trip) {
        // Add validation logic here
        if (trip.getStartLocation() == null || trip.getEndLocation() == null || 
            trip.getStartDate() == null || trip.getEndDate() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Save trip using service
        Trip savedTrip = tripService.saveTrip(trip);
        
        // Generate AI recommendations for the trip
        CompletableFuture<String> recommendationsFuture = geminiAIService.getTravelRecommendations(trip);
        CompletableFuture<String> itineraryFuture = geminiAIService.generateItinerary(trip);
        
        // Combine results
        CompletableFuture<Map<String, Object>> combinedFuture = recommendationsFuture.thenCombine(
            itineraryFuture, (recommendations, itinerary) -> {
                Map<String, Object> response = new HashMap<>();
                response.put("trip", savedTrip);
                response.put("recommendations", recommendations);
                response.put("itinerary", itinerary);
                return response;
            }
        );
        
        // Complete response
        Map<String, Object> response = new HashMap<>();
        response.put("trip", savedTrip);
        response.put("message", "Trip created successfully! AI insights are being generated.");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{index}")
    public ResponseEntity<Trip> getTripByIndex(@PathVariable int index) {
        Trip trip = tripService.getTripByIndex(index);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trip);
    }
    
    @GetMapping("/latest/insights")
    public ResponseEntity<Map<String, Object>> getLatestTripInsights() {
        List<Trip> trips = tripService.getAllTrips();
        if (trips.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No trips available");
            return ResponseEntity.ok(response);
        }
        
        Trip latestTrip = trips.get(trips.size() - 1);
        
        // Get recommendations and itinerary for latest trip
        CompletableFuture<String> recommendationsFuture = geminiAIService.getTravelRecommendations(latestTrip);
        CompletableFuture<String> itineraryFuture = geminiAIService.generateItinerary(latestTrip);
        
        try {
            String recommendations = recommendationsFuture.get();
            String itinerary = itineraryFuture.get();
            
            Map<String, Object> response = new HashMap<>();
            response.put("trip", latestTrip);
            response.put("recommendations", recommendations);
            response.put("itinerary", itinerary);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to generate insights: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // Helper endpoint to check all saved trips (for debugging)
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugTrips() {
        Map<String, Object> response = new HashMap<>();
        response.put("count", tripService.getAllTrips().size());
        response.put("trips", tripService.getAllTrips());
        return ResponseEntity.ok(response);
    }
}