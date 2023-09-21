package com.mailApp.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserDto {
    private String username;
    private String firstName;
    private String lastName;
    private LocalDate dob;
}
