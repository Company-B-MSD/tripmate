package com.tripmate.SpringOAuth2.config;

import com.tripmate.SpringOAuth2.services.CustomOAuth2User;
import com.tripmate.SpringOAuth2.services.JWTService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JWTService jwtService;

    @Override
public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                    Authentication authentication) throws IOException, ServletException {
    
    CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
    
    // Generate JWT token for the OAuth2 user
    String token = jwtService.generateToken(oauth2User.getUsername());
    
    // Redirect to frontend with token (your React app URL)
    String targetUrl = "https://tripmate-ecru.vercel.app/oauth-success?token=" + token;

    
    getRedirectStrategy().sendRedirect(request, response, targetUrl);
}

}
