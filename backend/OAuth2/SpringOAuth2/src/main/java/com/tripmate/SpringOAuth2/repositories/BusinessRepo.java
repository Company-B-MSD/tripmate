package com.tripmate.SpringOAuth2.repositories;

import com.tripmate.SpringOAuth2.models.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessRepo extends JpaRepository<Business, Long> {
    
    // Find business by email
    Optional<Business> findByEmail(String email);
    
    // Check if business exists by email
    boolean existsByEmail(String email);
    
    // Find businesses by category
    List<Business> findByCategory(String category);
    
    // Find businesses by name (case insensitive)
    List<Business> findByNameContainingIgnoreCase(String name);
    
    // Find all active businesses
    List<Business> findByActiveTrue();
    
    // Find businesses by category and active status
    List<Business> findByCategoryAndActiveTrue(String category);
}
