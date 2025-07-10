package com.tripmate.SpringOAuth2.controllers;

import com.tripmate.SpringOAuth2.dto.BusinessRegistrationDto;
import com.tripmate.SpringOAuth2.models.Business;
import com.tripmate.SpringOAuth2.services.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/business")
public class BusinessController {
    
    @Autowired
    private BusinessService businessService;
    
    /**
     * API endpoint to register a new business
     * POST /api/business/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerBusiness(@RequestBody BusinessRegistrationDto businessDto) {
        try {
            Business registeredBusiness = businessService.registerBusiness(businessDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Business registered successfully");
            response.put("businessId", registeredBusiness.getId());
            response.put("business", registeredBusiness);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * API endpoint to get business details by ID
     * GET /api/business/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBusinessById(@PathVariable Long id) {
        try {
            Optional<Business> business = businessService.getBusinessById(id);
            if (business.isPresent()) {
                return ResponseEntity.ok(business.get());
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Business not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error retrieving business: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * API endpoint to update business details
     * PUT /api/business/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBusiness(@PathVariable Long id, @RequestBody BusinessRegistrationDto businessDto) {
        try {
            Business updatedBusiness = businessService.updateBusiness(id, businessDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Business updated successfully");
            response.put("business", updatedBusiness);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * API endpoint to get all businesses
     * GET /api/business/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<Business>> getAllBusinesses() {
        try {
            List<Business> businesses = businessService.getAllBusinesses();
            return ResponseEntity.ok(businesses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * API endpoint to get businesses by category
     * GET /api/business/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Business>> getBusinessesByCategory(@PathVariable String category) {
        try {
            List<Business> businesses = businessService.getBusinessesByCategory(category);
            return ResponseEntity.ok(businesses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * API endpoint to search businesses by name
     * GET /api/business/search?name={name}
     */
    @GetMapping("/search")
    public ResponseEntity<List<Business>> searchBusinesses(@RequestParam String name) {
        try {
            List<Business> businesses = businessService.searchBusinessesByName(name);
            return ResponseEntity.ok(businesses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * API endpoint to delete/deactivate a business
     * DELETE /api/business/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBusiness(@PathVariable Long id) {
        try {
            businessService.deleteBusiness(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Business deactivated successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
