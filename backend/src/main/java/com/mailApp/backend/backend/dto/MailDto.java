package com.mailApp.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class MailDto {
    private Integer id;
    private UserDto sender;
    private LocalDateTime dateTime;
    private String subject;
    private String content;
    private List<UserDto> receivers;
    private Boolean favorite;
}
