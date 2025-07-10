package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.models.PlaceSuggestion;
import com.tripmate.SpringOAuth2.models.TripRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaceService {
    public List<PlaceSuggestion> getTopRatedPlaces(TripRequest request) {
        // Rely on frontend-provided attractions (customPlaces)
        List<PlaceSuggestion> places = new ArrayList<>();
        if (request.getCustomPlaces() != null) {
            places = request.getCustomPlaces().stream()
                    .map(name -> {
                        PlaceSuggestion ps = new PlaceSuggestion();
                        ps.setName(name);
                        ps.setType("tourist_attraction");
                        ps.setLocation("Sri Lanka");
                        ps.setDescription("User-selected attraction");
                        ps.setRating(3.0);
                        return ps;
                    })
                    .collect(Collectors.toList());
        }
        return places;
    }
}