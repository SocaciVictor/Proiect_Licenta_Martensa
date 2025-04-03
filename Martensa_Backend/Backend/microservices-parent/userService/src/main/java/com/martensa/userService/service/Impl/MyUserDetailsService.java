package com.martensa.userService.service.Impl;

import com.martensa.userService.model.MyUserDetails;
import com.martensa.userService.model.User;
import com.martensa.userService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> user = userRepository.findByEmail(username);

        if (!user.isPresent()) {
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        if (user.get().getPassword() == null || user.get().getPassword().isEmpty()) {
            throw new IllegalStateException("Stored password cannot be null or empty. Check user data integrity.");
        }

        return new MyUserDetails(user.get());
    }
}
