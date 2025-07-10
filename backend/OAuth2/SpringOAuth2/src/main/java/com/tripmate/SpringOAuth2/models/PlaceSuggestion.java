package com.tripmate.SpringOAuth2.models;

public class PlaceSuggestion {
    private String name;
    private String type;
    private String location;
    private String description;
    private double rating;
    private int userRatingsTotal;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getUserRatingsTotal() { return userRatingsTotal; }
    public void setUserRatingsTotal(int userRatingsTotal) { this.userRatingsTotal = userRatingsTotal; }
}