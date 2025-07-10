package com.tripmate.SpringOAuth2.models;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

public class Trip {
    private Long id;
    private String startLocation;
    private List<String> stops;
    private String endLocation;
    private int numberOfTravelers;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private double budget; 

    public Trip() {
    }

    public Trip(Long id,String startLocation, List<String> stops, String endLocation, int numberOfTravelers, 
               LocalDate startDate, LocalDate endDate, double budget) {
    //public Trip(, String startingLocation, List<String> stops, String finalDestination, 
    //                int travelers, double budget, String startDate, String endDate) {
        this.id=id;
        this.startLocation = startLocation;
        this.stops = stops;
        this.endLocation = endLocation;
        this.numberOfTravelers = numberOfTravelers;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;


    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }

    public List<String> getStops() {
        return stops;
    }

    public void setStops(List<String> stops) {
        this.stops = stops;
    }

    public String getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(String endLocation) {
        this.endLocation = endLocation;
    }

    public int getNumberOfTravelers() {
        return numberOfTravelers;
    }

    public void setNumberOfTravelers(int numberOfTravelers) {
        this.numberOfTravelers = numberOfTravelers;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public double getBudget() {
        return budget;
    }
    
    public void setBudget(double budget) {
        this.budget = budget;
    }
}

