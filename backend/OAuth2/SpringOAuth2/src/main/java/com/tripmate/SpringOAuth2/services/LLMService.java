package com.tripmate.SpringOAuth2.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class LLMService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${google.gemini.api.key}")
    private String apiKey;

    // Fixed Gemini API endpoint
    private static final String GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

    public String getTripPlan(String prompt) {
        Map<String, Object> payload = new HashMap<>();

        // Enhanced prompt for better structured response
        String enhancedPrompt = "You are a Sri Lankan travel expert. " + prompt + "\n\n" +
                "Please provide a comprehensive response in the following format:\n" +
                "1. DETAILED ITINERARY:\n[Day-by-day plan with specific activities, timings, and locations]\n\n" +
                "2. JSON STRUCTURE:\n```json\n{\n  \"days\": [\n    {\n      \"day\": 1,\n      \"activities\": [\"Morning: Visit Temple of Tooth\", \"Afternoon: Royal Botanical Gardens\"],\n      \"meals\": [\"Breakfast at hotel\", \"Lunch at local restaurant\"],\n      \"accommodation\": \"Hotel recommendations\"\n    }\n  ],\n  \"totalCost\": 50000,\n  \"transportation\": \"Car rental details\"\n}\n```\n\n" +
                "3. BUDGET BREAKDOWN:\n[Detailed cost analysis for accommodation, food, transport, activities]\n\n" +
                "4. RECOMMENDED PLACES:\n[List of must-visit locations with brief descriptions]\n\n" +
                "5. TRAVEL TIPS:\n[Sri Lanka specific advice, cultural notes, weather considerations]\n\n" +
                "Keep all recommendations within Sri Lanka and provide realistic LKR pricing.";

        payload.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", enhancedPrompt)))
        ));

        // Add generation config for better responses
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("topK", 40);
        generationConfig.put("topP", 0.95);
        generationConfig.put("maxOutputTokens", 8192);
        generationConfig.put("responseMimeType", "text/plain");
        payload.put("generationConfig", generationConfig);

        // Add safety settings
        List<Map<String, Object>> safetySettings = List.of(
                Map.of("category", "HARM_CATEGORY_HARASSMENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_HATE_SPEECH", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE")
        );
        payload.put("safetySettings", safetySettings);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GEMINI_ENDPOINT, HttpMethod.POST, entity, Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List<Map> candidates = (List<Map>) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = candidates.get(0);
                    if (candidate.containsKey("content")) {
                        Map content = (Map) candidate.get("content");
                        if (content.containsKey("parts")) {
                            List<Map> parts = (List<Map>) content.get("parts");
                            if (!parts.isEmpty() && parts.get(0).containsKey("text")) {
                                return (String) parts.get(0).get("text");
                            }
                        }
                    }
                }
            }

            return "No response generated from Gemini API";

        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            e.printStackTrace();
            return "Error calling LLM: " + e.getMessage();
        }
    }
}