package com.mailApp.backend.backend.services;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class Base64BasicAuthDecoder {

    public String getUsernameFromAuthHeader(String header) {
        String decodedCredentials = new String(
                Base64.getDecoder().decode(header.split(" ")[1]),
                StandardCharsets.UTF_8
        );
        return decodedCredentials.split(":")[0];
    }
}
