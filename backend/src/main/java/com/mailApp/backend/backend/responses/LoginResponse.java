package com.mailApp.backend.backend.responses;

import com.mailApp.backend.backend.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private UserDto userDto;
}
