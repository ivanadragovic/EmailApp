package com.mailApp.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ThreadDto {
    private String username;
    private LocalDateTime dateTime;
    private String content;
}
