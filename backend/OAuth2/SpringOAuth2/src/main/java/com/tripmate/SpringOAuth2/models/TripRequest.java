package com.tripmate.SpringOAuth2.models;

import java.util.List;

public class TripRequest {
    private String start;
    private String end;
    private int days;
    private int people;
    private int budget;
    private String notes;
    private List<String> customPlaces;

    // Getters and Setters
    public String getStart() { return start; }
    public void setStart(String start) { this.start = start; }
    public String getEnd() { return end; }
    public void setEnd(String end) { this.end = end; }
    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }
    public int getPeople() { return people; }
    public void setPeople(int people) { this.people = people; }
    public int getBudget() { return budget; }
    public void setBudget(int budget) { this.budget = budget; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<String> getCustomPlaces() { return customPlaces; }
    public void setCustomPlaces(List<String> customPlaces) { this.customPlaces = customPlaces; }
}