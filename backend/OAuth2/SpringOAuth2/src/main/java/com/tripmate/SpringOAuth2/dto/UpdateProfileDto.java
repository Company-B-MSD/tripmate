package com.tripmate.SpringOAuth2.dto;

public class UpdateProfileDto {
    private String name;
    private String email;
    private String profilePictureUrl;
    
    // Constructors
    public UpdateProfileDto() {}
    
    public UpdateProfileDto(String name, String email, String profilePictureUrl) {
        this.name = name;
        this.email = email;
        this.profilePictureUrl = profilePictureUrl;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
    
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}
