package com.tripmate.SpringOAuth2.models;

import java.util.List;
import java.util.Map;

public class TripResponse {
    private String itineraryText;
    private String structuredPlan;
    private double estimatedBudget;
    private Map<String, Double> budgetBreakdown;
    private List<PlaceSuggestion> suggestedPlaces;
    private List<String> recommendedPlaces;

    public TripResponse() {}

    public TripResponse(String error) {
        this.itineraryText = error;
    }

    // Getters and Setters
    public String getItineraryText() { return itineraryText; }
    public void setItineraryText(String itineraryText) { this.itineraryText = itineraryText; }
    public String getStructuredPlan() { return structuredPlan; }
    public void setStructuredPlan(String structuredPlan) { this.structuredPlan = structuredPlan; }
    public double getEstimatedBudget() { return estimatedBudget; }
    public void setEstimatedBudget(double estimatedBudget) { this.estimatedBudget = estimatedBudget; }
    public Map<String, Double> getBudgetBreakdown() { return budgetBreakdown; }
    public void setBudgetBreakdown(Map<String, Double> budgetBreakdown) { this.budgetBreakdown = budgetBreakdown; }
    public List<PlaceSuggestion> getSuggestedPlaces() { return suggestedPlaces; }
    public void setSuggestedPlaces(List<PlaceSuggestion> suggestedPlaces) { this.suggestedPlaces = suggestedPlaces; }
    public List<String> getRecommendedPlaces() { return recommendedPlaces; }
    public void setRecommendedPlaces(List<String> recommendedPlaces) { this.recommendedPlaces = recommendedPlaces; }
}