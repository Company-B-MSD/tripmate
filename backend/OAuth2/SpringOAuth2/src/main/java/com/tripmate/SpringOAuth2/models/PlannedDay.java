package com.tripmate.SpringOAuth2.models;


import java.util.List;

public class PlannedDay {
    private int day;
    private List<String> activities;

    // Getters and Setters
    public int getDay() { return day; }
    public void setDay(int day) { this.day = day; }

    public List<String> getActivities() { return activities; }
    public void setActivities(List<String> activities) { this.activities = activities; }
}