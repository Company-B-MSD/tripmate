package com.tripmate.SpringOAuth2.controllers;

import com.tripmate.SpringOAuth2.dto.ChangePasswordDto;
import com.tripmate.SpringOAuth2.dto.UpdateProfileDto;
import com.tripmate.SpringOAuth2.dto.UserProfileDto;
import com.tripmate.SpringOAuth2.models.Users;
import com.tripmate.SpringOAuth2.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = userService.getUserByUsername(username);
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Convert to DTO (no password exposure)
            UserProfileDto profile = new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getProfilePictureUrl(),
                user.getProvider()
            );
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching profile: " + e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileDto updateDto, 
                                         Authentication authentication) {
        try {
            String username = authentication.getName();
            
            Users updatedUser = userService.updateProfile(
                username,
                updateDto.getName(),
                updateDto.getEmail(),
                updateDto.getProfilePictureUrl()
            );
            
            // Convert to DTO
            UserProfileDto profile = new UserProfileDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getName(),
                updatedUser.getProfilePictureUrl(),
                updatedUser.getProvider()
            );
            
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto changePasswordDto,
                                          Authentication authentication) {
        try {
            String username = authentication.getName();
            System.out.println("Changing password for user: " + username);
            
            // Validate input
            if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("New password and confirm password do not match");
            }
            
            userService.changePassword(
                username,
                changePasswordDto.getCurrentPassword(),
                changePasswordDto.getNewPassword()
            );
            
            return ResponseEntity.ok().body("{\"message\":\"Password changed successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error changing password: " + e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAccount(@RequestBody(required = false) String password,
                                         Authentication authentication) {
        try {
            String username = authentication.getName();
            
            // Extract password from request body if it's a JSON object
            String actualPassword = password;
            if (password != null && password.startsWith("{") && password.contains("password")) {
                // Simple JSON parsing for password field
                actualPassword = password.replaceAll(".*\"password\"\\s*:\\s*\"([^\"]+)\".*", "$1");
            }
            
            userService.deleteAccount(username, actualPassword);
            
            return ResponseEntity.ok().body("{\"message\":\"Account deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting account: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getProfileStats(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = userService.getUserByUsername(username);
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            // You can extend this to include more stats like trip count, etc.
            return ResponseEntity.ok().body("{" +
                "\"userId\":" + user.getId() + "," +
                "\"accountType\":\"" + user.getProvider() + "\"," +
                "\"hasProfilePicture\":" + (user.getProfilePictureUrl() != null) + "," +
                "\"profileComplete\":" + isProfileComplete(user) +
                "}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching profile stats: " + e.getMessage());
        }
    }
    
    private boolean isProfileComplete(Users user) {
        return user.getName() != null && !user.getName().trim().isEmpty() &&
               user.getEmail() != null && !user.getEmail().trim().isEmpty();
    }
}
