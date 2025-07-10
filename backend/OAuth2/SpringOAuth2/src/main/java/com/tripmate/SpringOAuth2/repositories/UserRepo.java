package com.tripmate.SpringOAuth2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tripmate.SpringOAuth2.models.Users;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository <Users, Integer>{
    
    Users findByUsername(String username);
    
    // Additional methods for better user management
    boolean existsByUsername(String username);
    
    // OAuth2 integration methods
    Users findByEmail(String email);
    boolean existsByEmail(String email);
    
    // Find user by OAuth2 provider and provider ID
    Users findByProviderAndProviderId(String provider, String providerId);
    
    // Check if OAuth2 user exists
    boolean existsByProviderAndProviderId(String provider, String providerId);
}
