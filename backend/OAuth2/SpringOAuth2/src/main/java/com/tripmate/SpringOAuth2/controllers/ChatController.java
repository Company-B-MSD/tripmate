package com.tripmate.SpringOAuth2.controllers;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/chat")
public class ChatController {

    @PostMapping
    public ResponseEntity<Map<String, String>> chatWithBot(@RequestBody Map<String, String> body) {
        RestTemplate restTemplate = new RestTemplate();
        String fastApiUrl = "http://localhost:8001/chat";
        // Make sure your FastAPI is running on this
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(fastApiUrl, request, String.class);
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("reply", response.getBody());
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
        }
    }
}