package com.mailApp.backend.backend.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PasswordChangeRequest {
    private String username;
    private String newPassword;
}
