package com.mailApp.backend.backend.entities;

import com.mailApp.backend.backend.dto.UserDto;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    @Enumerated(EnumType.STRING)
    private Role role;
    private Boolean enabled;

    public UserDto toUserDto() {
        return new UserDto(
                this.username,
                this.firstName,
                this.lastName,
                this.dob
        );
    }

    public enum Role {
        USER
    }
}
