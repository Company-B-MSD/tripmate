// package com.tripmate.SpringOAuth2.config;

// import java.beans.BeanProperty;
// import java.nio.file.attribute.UserDefinedFileAttributeView;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.AuthenticationProvider;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Autowired
//     private JwtFilter jwtFilter;

//     @Autowired
//     private UserDetailsService userDetailsService;

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         return http
//             .authorizeHttpRequests(requests -> requests
//                 .requestMatchers("register", "login", "home").permitAll() // Allow access to these endpoints without authentication
//                 .anyRequest().authenticated()
//             )
//             .formLogin(Customizer.withDefaults())
//             .httpBasic(Customizer.withDefaults())
//             .sessionManagement(session -> session
//                 .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//             .oauth2Login(oauth2Login -> oauth2Login.defaultSuccessUrl("/home", true))
//             .csrf(csrf -> csrf.disable()) 
//             .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//             .build();
//     }


//     @Bean 
//     public AuthenticationProvider authenticationProvider(){
//         DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//         provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
//         provider.setUserDetailsService(userDetailsService);
//         return provider;
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//         return config.getAuthenticationManager();
//     }

// }