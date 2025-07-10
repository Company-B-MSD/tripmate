package com.tripmate.SpringOAuth2.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GoogleMapsService {

    @Value("${google.maps.api.key:YOUR_MAPS_API_KEY}")
    private String apiKey;
    
    private final WebClient webClient;
    
    public GoogleMapsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
            .baseUrl("https://maps.googleapis.com/maps/api")
            .build();
    }
    
    // Methods will be implemented later
}