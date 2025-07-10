package com.tripmate.SpringOAuth2.dto;

public class UserProfileDto {
    private int id;
    private String username;
    private String email;
    private String name;
    private String profilePictureUrl;
    private String provider;
    
    // Constructors
    public UserProfileDto() {}
    
    public UserProfileDto(int id, String username, String email, String name, 
                         String profilePictureUrl, String provider) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.profilePictureUrl = profilePictureUrl;
        this.provider = provider;
    }
    
    // Getters and Setters
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
}
