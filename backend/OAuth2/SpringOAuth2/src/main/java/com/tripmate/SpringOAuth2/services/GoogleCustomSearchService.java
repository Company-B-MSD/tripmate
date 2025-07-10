package com.tripmate.SpringOAuth2.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GoogleCustomSearchService {

    @Value("${google.customsearch.api.key:CUSTOM_SEARCH_API_KEY}")
    private String apiKey;
    
    @Value("${google.customsearch.cx:CUSTOM_SEARCH_ENGINE_ID}")
    private String searchEngineId;
    
    private final WebClient webClient;
    
    public GoogleCustomSearchService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
            .baseUrl("https://www.googleapis.com/customsearch/v1")
            .build();
    }
    
    // Methods will be implemented later
}