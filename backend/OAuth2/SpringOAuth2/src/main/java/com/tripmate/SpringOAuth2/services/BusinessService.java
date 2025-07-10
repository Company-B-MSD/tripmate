package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.models.Business;
import com.tripmate.SpringOAuth2.repositories.BusinessRepo;
import com.tripmate.SpringOAuth2.dto.BusinessRegistrationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusinessService {
    
    @Autowired
    private BusinessRepo businessRepo;
    
    /**
     * Register a new business
     */
    public Business registerBusiness(BusinessRegistrationDto registrationDto) {
        // Validate required fields
        if (registrationDto.getName() == null || registrationDto.getName().trim().isEmpty()) {
            throw new RuntimeException("Business name is required");
        }
        
        if (registrationDto.getAddress() == null || registrationDto.getAddress().trim().isEmpty()) {
            throw new RuntimeException("Business address is required");
        }
        
        if (registrationDto.getEmail() == null || registrationDto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Business email is required");
        }
        
        if (registrationDto.getTelephone() == null || registrationDto.getTelephone().trim().isEmpty()) {
            throw new RuntimeException("Business telephone is required");
        }
        
        // Check if email already exists
        if (businessRepo.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("A business with this email already exists");
        }
        
        // Validate email format (basic validation)
        if (!isValidEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Please provide a valid email address");
        }
        
        // Create new business
        Business business = new Business();
        business.setName(registrationDto.getName().trim());
        business.setAddress(registrationDto.getAddress().trim());
        business.setEmail(registrationDto.getEmail().trim().toLowerCase());
        business.setTelephone(registrationDto.getTelephone().trim());
        
        // Set optional fields
        if (registrationDto.getWebsite() != null && !registrationDto.getWebsite().trim().isEmpty()) {
            business.setWebsite(registrationDto.getWebsite().trim());
        }
        
        if (registrationDto.getDescription() != null && !registrationDto.getDescription().trim().isEmpty()) {
            business.setDescription(registrationDto.getDescription().trim());
        }
        
        if (registrationDto.getCategory() != null && !registrationDto.getCategory().trim().isEmpty()) {
            business.setCategory(registrationDto.getCategory().trim());
        }
        
        return businessRepo.save(business);
    }
    
    /**
     * Get all businesses
     */
    public List<Business> getAllBusinesses() {
        return businessRepo.findByActiveTrue();
    }
    
    /**
     * Get business by ID
     */
    public Optional<Business> getBusinessById(Long id) {
        return businessRepo.findById(id);
    }
    
    /**
     * Get businesses by category
     */
    public List<Business> getBusinessesByCategory(String category) {
        return businessRepo.findByCategoryAndActiveTrue(category);
    }
    
    /**
     * Search businesses by name
     */
    public List<Business> searchBusinessesByName(String name) {
        return businessRepo.findByNameContainingIgnoreCase(name);
    }
    
    /**
     * Update business status (activate/deactivate)
     */
    public Business updateBusinessStatus(Long id, boolean active) {
        Optional<Business> businessOpt = businessRepo.findById(id);
        if (businessOpt.isPresent()) {
            Business business = businessOpt.get();
            business.setActive(active);
            return businessRepo.save(business);
        }
        throw new RuntimeException("Business not found with ID: " + id);
    }
    
    /**
     * Delete business (soft delete by setting active to false)
     */
    public void deleteBusiness(Long id) {
        updateBusinessStatus(id, false);
    }
    
    /**
     * Update business details
     */
    public Business updateBusiness(Long id, BusinessRegistrationDto businessDto) {
        Optional<Business> businessOpt = businessRepo.findById(id);
        if (!businessOpt.isPresent()) {
            throw new RuntimeException("Business not found with ID: " + id);
        }
        
        Business business = businessOpt.get();
        
        // Validate required fields
        if (businessDto.getName() == null || businessDto.getName().trim().isEmpty()) {
            throw new RuntimeException("Business name is required");
        }
        
        if (businessDto.getAddress() == null || businessDto.getAddress().trim().isEmpty()) {
            throw new RuntimeException("Business address is required");
        }
        
        if (businessDto.getEmail() == null || businessDto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Business email is required");
        }
        
        if (businessDto.getTelephone() == null || businessDto.getTelephone().trim().isEmpty()) {
            throw new RuntimeException("Business telephone is required");
        }
        
        // Check if email already exists for another business
        Optional<Business> existingBusinessWithEmail = businessRepo.findByEmail(businessDto.getEmail());
        if (existingBusinessWithEmail.isPresent() && !existingBusinessWithEmail.get().getId().equals(id)) {
            throw new RuntimeException("A business with this email already exists");
        }
        
        // Validate email format
        if (!isValidEmail(businessDto.getEmail())) {
            throw new RuntimeException("Please provide a valid email address");
        }
        
        // Update business fields
        business.setName(businessDto.getName().trim());
        business.setAddress(businessDto.getAddress().trim());
        business.setEmail(businessDto.getEmail().trim().toLowerCase());
        business.setTelephone(businessDto.getTelephone().trim());
        
        // Update optional fields
        business.setWebsite(businessDto.getWebsite() != null && !businessDto.getWebsite().trim().isEmpty() 
                           ? businessDto.getWebsite().trim() : null);
        
        business.setDescription(businessDto.getDescription() != null && !businessDto.getDescription().trim().isEmpty() 
                               ? businessDto.getDescription().trim() : null);
        
        business.setCategory(businessDto.getCategory() != null && !businessDto.getCategory().trim().isEmpty() 
                            ? businessDto.getCategory().trim() : null);
        
        return businessRepo.save(business);
    }
    
    /**
     * Basic email validation
     */
    private boolean isValidEmail(String email) {
        return email != null && email.contains("@") && email.contains(".");
    }
}
