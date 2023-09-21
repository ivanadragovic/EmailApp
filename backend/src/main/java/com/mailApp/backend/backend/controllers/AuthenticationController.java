package com.mailApp.backend.backend.controllers;

import com.mailApp.backend.backend.entities.User;
import com.mailApp.backend.backend.requests.LoginRequest;
import com.mailApp.backend.backend.requests.PasswordChangeRequest;
import com.mailApp.backend.backend.requests.RegisterRequest;
import com.mailApp.backend.backend.responses.LoginResponse;
import com.mailApp.backend.backend.responses.PasswordChangeResponse;
import com.mailApp.backend.backend.responses.RegisterResponse;
import com.mailApp.backend.backend.security.MyPasswordEncoder;
import com.mailApp.backend.backend.services.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("authentication")
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final MyPasswordEncoder myPasswordEncoder;

    public AuthenticationController(
            AuthenticationService authenticationService,
            MyPasswordEncoder myPasswordEncoder
    ) {
        this.authenticationService = authenticationService;
        this.myPasswordEncoder = myPasswordEncoder;
    }

    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new LoginResponse(null));
        }
        Optional<User> user = authenticationService.getUserByUsername(loginRequest.getUsername());
        if (user.isPresent()) {
            if (myPasswordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
                return ResponseEntity.status(HttpStatus.OK).body(new LoginResponse(user.get().toUserDto()));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(null));
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(null));
        }
    }

    @PostMapping("register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        if (registerRequest.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RegisterResponse(false));
        }
        Optional<User> user = authenticationService.getUserByUsername(registerRequest.getUsername());
        if (user.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    new RegisterResponse(false)
            );
        } else {
            authenticationService.saveUser(
                new User(
                    registerRequest.getUsername(),
                    myPasswordEncoder.encode(registerRequest.getPassword()),
                    registerRequest.getFirstName(),
                    registerRequest.getLastName(),
                    registerRequest.getDob(),
                    User.Role.USER,
                    true
                )
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(new RegisterResponse(true));
        }
    }

    @PostMapping("changePassword")
    public ResponseEntity<PasswordChangeResponse> changePassword(
            @RequestBody PasswordChangeRequest passwordChangeRequest
    ) {
        if (passwordChangeRequest.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new PasswordChangeResponse(false));
        }
        Optional<User> user = authenticationService.getUserByUsername(passwordChangeRequest.getUsername());
        if (user.isPresent()) {
            if (myPasswordEncoder.matches(passwordChangeRequest.getNewPassword(), user.get().getPassword())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new PasswordChangeResponse(false));
            }
            user.get().setPassword(myPasswordEncoder.encode(passwordChangeRequest.getNewPassword()));
            authenticationService.saveUser(user.get());
            return ResponseEntity.status(HttpStatus.OK).body(new PasswordChangeResponse(true));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new PasswordChangeResponse(false));
        }
    }
}
