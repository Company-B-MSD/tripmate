package com.tripmate.SpringOAuth2.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Controller;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@Controller
public class HelloController {

    @GetMapping("/")
    public String root() {
        return "redirect:/home";
    }

    @GetMapping("/trips")
    public String trips() {
        return "trips";
    }

    // @PostMapping("/api/trips")
    // @ResponseBody
    // public ResponseEntity<Map<String, Object>> createTrip(@RequestBody Map<String, Object> tripData) {
    //     // In a real app, you would save this to a database
    //     // For dev purposes, we'll just return the data with an ID added
        
    //     Map<String, Object> response = new HashMap<>(tripData);
    //     // Add some kind of ID (in real app, this would come from DB)
    //     response.put("id", System.currentTimeMillis());
    //     response.put("created", true);
        
    //     // Return 201 Created status with the new resource
    //     return ResponseEntity.status(201).body(response);
    // }
}