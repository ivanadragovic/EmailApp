package com.mailApp.backend.backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class MyPasswordEncoder implements PasswordEncoder {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public String encode(CharSequence rawText) {
        return passwordEncoder.encode(rawText);
    }

    @Override
    public boolean matches(CharSequence rawText, String encodedText) {
        return passwordEncoder.matches(rawText, encodedText);
    }
}
