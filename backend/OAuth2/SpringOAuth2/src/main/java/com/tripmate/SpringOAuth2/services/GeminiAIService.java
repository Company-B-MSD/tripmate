package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.models.Trip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class GeminiAIService {

    @Value("${gemini.api.key:AIzaSyAs-T5A3A8I8BwlvS0yMn4d4F9drh0LFdo}")
    private String apiKey;

    @Value("${gemini.model.name:gemini-pro}")
    private String modelName;
    
    private final WebClient webClient;
    
    @Autowired
    public GeminiAIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta").build();
    }
    
    /**
     * Generates travel recommendations based on the provided trip
     */
    public CompletableFuture<String> getTravelRecommendations(Trip trip) {
        String prompt = buildTripPrompt(trip);
        return callGeminiAI(prompt).toFuture();
    }
    
    /**
     * Generates an itinerary for the provided trip
     */
    public CompletableFuture<String> generateItinerary(Trip trip) {
        String prompt = buildItineraryPrompt(trip);
        return callGeminiAI(prompt).toFuture();
    }
    
    /**
     * Analyzes multiple trips to provide insights or recommendations
     */
    public CompletableFuture<String> analyzeTripData(List<Trip> trips) {
        String prompt = buildAnalysisPrompt(trips);
        return callGeminiAI(prompt).toFuture();
    }
    
    /**
     * Makes the actual API call to Gemini
     */
    private Mono<String> callGeminiAI(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        
        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("text", prompt);
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(contentPart));
        
        requestBody.put("contents", List.of(content));
        
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 2048);
        
        requestBody.put("generationConfig", generationConfig);
        
        return webClient
            .post()
            .uri("/models/" + modelName + ":generateContent?key=" + apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map.class)
            .map(this::extractTextFromResponse)
            .onErrorResume(e -> {
                System.err.println("Error calling Gemini API: " + e.getMessage());
                return Mono.just("Error generating AI content: " + e.getMessage());
            });
    }
    
    private String extractTextFromResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "No response from Gemini API";
            }
            
            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            return "Error parsing Gemini response: " + e.getMessage();
        }
    }
    
    /**
     * Builds a detailed prompt for travel recommendations based on trip data
     */
/**
 * Builds a prompt for concise travel recommendations based on trip data
 */
private String buildTripPrompt(Trip trip) {
    long tripDays = ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1;
    
    StringBuilder promptBuilder = new StringBuilder();
    promptBuilder.append("As a travel expert, provide brief travel recommendations for this trip. Keep your response short and sweet without any bold formatting:\n\n");
    promptBuilder.append("- Starting Location: ").append(trip.getStartLocation()).append("\n");
    
    if (trip.getStops() != null && !trip.getStops().isEmpty()) {
        promptBuilder.append("- Stops: ").append(String.join(", ", trip.getStops())).append("\n");
    }
    
    promptBuilder.append("- Final Destination: ").append(trip.getEndLocation()).append("\n");
    promptBuilder.append("- Travelers: ").append(trip.getNumberOfTravelers()).append("\n");
    promptBuilder.append("- Budget: $").append(trip.getBudget()).append("\n");
    promptBuilder.append("- Duration: ").append(tripDays).append(" days\n\n");
    
    promptBuilder.append("Briefly list (no more than 1 sentence each):\n");
    promptBuilder.append("1. Best transportation option\n");
    promptBuilder.append("2. Top attraction at each location\n");
    promptBuilder.append("3. One budget-friendly restaurant\n");
    promptBuilder.append("4. Recommended accommodation\n");
    promptBuilder.append("5. One short travel tip\n\n");
    
    promptBuilder.append("IMPORTANT: Keep total response under 200 words. Use simple formatting only. Do NOT use bold text or lengthy descriptions. INCLUDE ONLY THE RECOMMENDATIONS!");
    
    return promptBuilder.toString();
}
    
    /**
     * Builds a prompt for generating a detailed day-by-day itinerary
     */
    private String buildItineraryPrompt(Trip trip) {
        long tripDays = ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Please create a detailed day-by-day itinerary for the following trip:\n\n");
        promptBuilder.append("- Starting Location: ").append(trip.getStartLocation()).append("\n");
        
        if (trip.getStops() != null && !trip.getStops().isEmpty()) {
            promptBuilder.append("- Stops Along the Way: ").append(String.join(", ", trip.getStops())).append("\n");
        }
        
        promptBuilder.append("- Final Destination: ").append(trip.getEndLocation()).append("\n");
        promptBuilder.append("- Number of Travelers: ").append(trip.getNumberOfTravelers()).append("\n");
        promptBuilder.append("- Trip Budget: $").append(trip.getBudget()).append("\n");
        promptBuilder.append("- Trip Duration: ").append(tripDays).append(" days\n");
        
        promptBuilder.append("\nPlease provide a day-by-day itinerary with activities and estimated costs.");
        
        return promptBuilder.toString();
    }
    
    /**
     * Builds a prompt for analyzing multiple trips
     */
    private String buildAnalysisPrompt(List<Trip> trips) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("As a travel analytics expert, analyze the following trip data and PROVIDE ONLY THE RECOMMENDED TOURIST LOCATIONS SEPARATED BY $ CHARACTER. DO NOT PROVIDE ANY OTHER TEXT OR EXPLANATION.\n\n");
        
        for (int i = 0; i < trips.size(); i++) {
            Trip trip = trips.get(i);
            long tripDays = ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1;
            
            promptBuilder.append("Trip #").append(i + 1).append(":\n");
            promptBuilder.append("- Route: ").append(trip.getStartLocation()).append(" → ");
            
            if (trip.getStops() != null && !trip.getStops().isEmpty()) {
                promptBuilder.append(String.join(" → ", trip.getStops())).append(" → ");
            }
            
            promptBuilder.append(trip.getEndLocation()).append("\n");
            promptBuilder.append("- Travelers: ").append(trip.getNumberOfTravelers()).append("\n");
            promptBuilder.append("- Budget: $").append(trip.getBudget()).append("\n");
            promptBuilder.append("- Duration: ").append(tripDays).append(" days (")
                        .append(trip.getStartDate()).append(" to ")
                        .append(trip.getEndDate()).append(")\n\n");
        }
        
        promptBuilder.append("IMPORTANT: Respond ONLY with the recommended tourist locations (give at least 5 locations) separated by '$'. DO NOT include any headings, explanations, or extra text.\n");
        
        return promptBuilder.toString();
    }
}