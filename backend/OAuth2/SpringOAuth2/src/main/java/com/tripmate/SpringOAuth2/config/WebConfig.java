package com.tripmate.SpringOAuth2.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow all origins, headers, and methods for development
        // For production, you should restrict these to specific values
        config.addAllowedOrigin("http://localhost:9001");
        config.addAllowedOrigin("http://localhost:9002");
        config.addAllowedOrigin("http://localhost:9000");
        config.addAllowedOrigin("http://localhost:9003"); // React app's default port
        config.addAllowedOrigin("http://localhost:9004");
        config.addAllowedOrigin("http://localhost:8080"); // Common alternative React port
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}