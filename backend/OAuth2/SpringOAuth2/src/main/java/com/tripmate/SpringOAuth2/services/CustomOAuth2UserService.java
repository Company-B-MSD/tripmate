package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.models.Users;
import com.tripmate.SpringOAuth2.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oauth2User.getAttributes();
        
        // Process the OAuth2 user and save to database
        Users user = processOAuth2User(registrationId, attributes);
        
        // Return a custom OAuth2User implementation
        return new CustomOAuth2User(oauth2User, user);
    }

    private Users processOAuth2User(String provider, Map<String, Object> attributes) {
        String providerId;
        String email;
        String name;
        String username;
        String profilePictureUrl;

        if ("google".equals(provider)) {
            providerId = (String) attributes.get("sub");
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            username = (String) attributes.get("email"); // Use email as username for Google
            profilePictureUrl = (String) attributes.get("picture");
        } else if ("github".equals(provider)) {
            providerId = String.valueOf(attributes.get("id"));
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            username = (String) attributes.get("login"); // Use GitHub login as username
            profilePictureUrl = (String) attributes.get("avatar_url");
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + provider);
        }

        // Check if user already exists
        Users existingUser = userRepo.findByProviderAndProviderId(provider, providerId);
        if (existingUser != null) {
            // Update existing user info
            existingUser.setEmail(email);
            existingUser.setName(name);
            existingUser.setProfilePictureUrl(profilePictureUrl);
            return userRepo.save(existingUser);
        }

        // Check if user exists with same email but different provider
        Users userWithSameEmail = userRepo.findByEmail(email);
        if (userWithSameEmail != null) {
            // Link the OAuth2 account to existing user
            userWithSameEmail.setProvider(provider);
            userWithSameEmail.setProviderId(providerId);
            userWithSameEmail.setName(name);
            userWithSameEmail.setProfilePictureUrl(profilePictureUrl);
            return userRepo.save(userWithSameEmail);
        }

        // Create new user
        Users newUser = new Users();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setProvider(provider);
        newUser.setProviderId(providerId);
        newUser.setProfilePictureUrl(profilePictureUrl);
        // OAuth2 users don't have passwords
        newUser.setPassword(null);

        return userRepo.save(newUser);
    }
}
