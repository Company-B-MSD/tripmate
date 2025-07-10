package com.tripmate.SpringOAuth2.models;

import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;

@Entity
public class Users {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = true) // OAuth2 users might not have passwords
    private String password;
    
    @Column(nullable = true)
    private String email;
    
    @Column(nullable = true)
    private String name;
    
    @Column(nullable = true)
    private String profilePictureUrl;
    
    @Column(nullable = true)
    private String provider; // "google", "github", "local"
    
    @Column(nullable = true)
    private String providerId; // OAuth2 provider's user ID
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
    
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
    
    public String getProvider() {
        return provider;
    }
    
    public void setProvider(String provider) {
        this.provider = provider;
    }
    
    public String getProviderId() {
        return providerId;
    }
    
    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
    @Override
    public String toString() {
        return "Users [id=" + id + ", username=" + username + ", email=" + email + 
               ", name=" + name + ", provider=" + provider + "]";
    }

    
    
}
