package com.tripmate.SpringOAuth2.utils;

import java.util.regex.Pattern;

public class ProfileValidator {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }
    
    public static boolean isValidName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        return name.trim().length() >= 1 && name.trim().length() <= 100;
    }
    
    public static boolean isValidPassword(String password) {
        if (password == null) {
            return false;
        }
        return password.length() >= 6;
    }
    
    public static boolean isValidProfilePictureUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return true; // Optional field
        }
        // Basic URL validation
        return url.startsWith("http://") || url.startsWith("https://");
    }
}
