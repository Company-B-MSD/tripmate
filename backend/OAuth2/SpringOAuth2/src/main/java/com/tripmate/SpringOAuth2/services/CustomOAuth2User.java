package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.models.Users;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {
    
    private final OAuth2User oauth2User;
    private final Users user;

    public CustomOAuth2User(OAuth2User oauth2User, Users user) {
        this.oauth2User = oauth2User;
        this.user = user;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("USER"));
    }

    @Override
    public String getName() {
        return user.getName() != null ? user.getName() : oauth2User.getName();
    }

    // Custom method to get the database user
    public Users getUser() {
        return user;
    }

    // Custom method to get username
    public String getUsername() {
        return user.getUsername();
    }

    // Custom method to get email
    public String getEmail() {
        return user.getEmail();
    }
}
