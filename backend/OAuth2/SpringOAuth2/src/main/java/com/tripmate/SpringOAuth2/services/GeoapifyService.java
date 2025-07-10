package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.dto.GeoapifyResponse;
import com.tripmate.SpringOAuth2.dto.HotelResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;


@Service
public class GeoapifyService {

    @Value("${geoapify.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String geocode(String address) {
        String url = "https://api.geoapify.com/v1/geocode/search?text=" + address + "&apiKey=" + apiKey;
        String json = restTemplate.getForObject(url, String.class);

        try {
            GeoapifyResponse response = objectMapper.readValue(json, GeoapifyResponse.class);

            if (response.getFeatures() != null && !response.getFeatures().isEmpty()) {
                GeoapifyResponse.Properties p = response.getFeatures().get(0).getProperties();
                return "City: " + p.getCity() + "\nCountry: " + p.getCountry() +
                        "\nLat: " + p.getLat() + "\nLon: " + p.getLon();
            } else {
                return "No location found.";
            }
        } catch (Exception e) {
            return "Error parsing response: " + e.getMessage();
        }
    }

    // Get nearby hotels using Geoapify Places API
    public String getNearbyHotels(double lat, double lon) {
        String url = String.format(
                "https://api.geoapify.com/v2/places?categories=accommodation.hotel&lat=%f&lon=%f&radius=5000&limit=10&apiKey=%s",
                lat, lon, apiKey);

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            HotelResponse response = objectMapper.readValue(jsonResponse, HotelResponse.class);

            StringBuilder result = new StringBuilder("Nearby Hotels:\n");
            for (HotelResponse.Feature feature : response.getFeatures()) {
                result.append("Name: ").append(feature.getProperties().getName())
                        .append(", Address: ").append(feature.getProperties().getFormatted())
                        .append("\n");
            }

            return result.toString();
        } catch (Exception e) {
            return "Error retrieving hotels: " + e.getMessage();
        }

    }

    public String getHotelsByTownName(String town) {
        try {
            // Step 1: Geocode the town name
            String geocodeUrl = String.format(
                    "https://api.geoapify.com/v1/geocode/search?text=%s&limit=1&apiKey=%s",
                    URLEncoder.encode(town, StandardCharsets.UTF_8), apiKey);

            String geocodeResponseJson = restTemplate.getForObject(geocodeUrl, String.class);

            // Parse lat/lon from response
            JsonNode root = objectMapper.readTree(geocodeResponseJson);
            JsonNode features = root.path("features");

            if (features.isEmpty()) {
                return "No location found for: " + town;
            }

            JsonNode geometry = features.get(0).path("geometry");
            double lat = geometry.path("coordinates").get(1).asDouble();
            double lon = geometry.path("coordinates").get(0).asDouble();

            // Step 2: Use lat/lon to get nearby hotels
            return getNearbyHotels(lat, lon);

        } catch (Exception e) {
            return "Error finding hotels by town: " + e.getMessage();
        }
    }

}