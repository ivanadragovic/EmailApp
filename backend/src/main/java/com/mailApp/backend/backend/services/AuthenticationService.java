package com.mailApp.backend.backend.services;

import com.mailApp.backend.backend.entities.User;
import com.mailApp.backend.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;

    @Autowired
    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserByUsername(String username) {
        return this.userRepository.findById(username);
    }
    public User saveUser(User user) {
        return this.userRepository.save(user);
    }
}
