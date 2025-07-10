package com.tripmate.SpringOAuth2.services;



import com.tripmate.SpringOAuth2.models.UserPrincipal;
import com.tripmate.SpringOAuth2.models.Users;
import com.tripmate.SpringOAuth2.repositories.UserRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService{

    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Users user = repo.findByUsername(username);
        
        // If not found by username, try to find by email (for OAuth2 users)
        if (user == null) {
            user = repo.findByEmail(username);
        }

        if (user == null){
            System.out.println("User Not Found: " + username);
            throw new UsernameNotFoundException("User Not Found: " + username);
        }
        return new UserPrincipal(user);
    }
    
}
