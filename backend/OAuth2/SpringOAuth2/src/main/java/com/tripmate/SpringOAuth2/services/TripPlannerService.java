package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.models.PlaceSuggestion;
import com.tripmate.SpringOAuth2.models.TripRequest;
import com.tripmate.SpringOAuth2.models.TripResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class TripPlannerService {

    @Autowired
    private LLMService llmService;

    public TripResponse planTrip(TripRequest request) {
        // Build prompt using attractions from frontend
        String prompt = PromptBuilder.buildEnhancedPrompt(request);

        // Get AI response
        String modelOutput = llmService.getTripPlan(prompt);

        // Parse the response
        Map<String, Object> parsedResponse = parseAIResponse(modelOutput);

        // Calculate budget
        Map<String, Double> budget = BudgetCalculator.calculate(request.getPeople(), request.getDays());

        // Build response
        TripResponse response = new TripResponse();
        response.setItineraryText(modelOutput);
        response.setEstimatedBudget(budget.get("Total"));
        response.setBudgetBreakdown(budget);

        if (parsedResponse.containsKey("jsonPlan")) {
            response.setStructuredPlan((String) parsedResponse.get("jsonPlan"));
        }
        if (parsedResponse.containsKey("recommendedPlaces")) {
            response.setRecommendedPlaces((List<String>) parsedResponse.get("recommendedPlaces"));
        }

        // Use frontend-provided attractions
        if (request.getCustomPlaces() != null && !request.getCustomPlaces().isEmpty()) {
            response.setSuggestedPlaces(request.getCustomPlaces().stream()
                    .map(name -> {
                        PlaceSuggestion ps = new PlaceSuggestion();
                        ps.setName(name);
                        ps.setType("tourist_attraction");
                        ps.setLocation("Sri Lanka");
                        ps.setDescription("User-selected attraction");
                        ps.setRating(3.0);
                        return ps;
                    })
                    .collect(Collectors.toList()));
        }

        return response;
    }

    private Map<String, Object> parseAIResponse(String response) {
        Map<String, Object> result = new HashMap<>();
        try {
            Pattern jsonPattern = Pattern.compile("```json\\s*([\\s\\S]*?)```", Pattern.MULTILINE);
            Matcher jsonMatcher = jsonPattern.matcher(response);
            if (jsonMatcher.find()) {
                result.put("jsonPlan", jsonMatcher.group(1).trim());
            }

            Pattern placesPattern = Pattern.compile("RECOMMENDED PLACES:\\s*([\\s\\S]*?)(?=\\n\\d+\\.|$)", Pattern.MULTILINE);
            Matcher placesMatcher = placesPattern.matcher(response);
            if (placesMatcher.find()) {
                String placesText = placesMatcher.group(1);
                List<String> places = Arrays.stream(placesText.split("\\n"))
                        .filter(place -> !place.trim().isEmpty())
                        .map(place -> place.replaceAll("^[-•*]\\s*", ""))
                        .collect(Collectors.toList());
                result.put("recommendedPlaces", places);
            }
        } catch (Exception e) {
            System.err.println("Error parsing AI response: " + e.getMessage());
        }
        return result;
    }
}