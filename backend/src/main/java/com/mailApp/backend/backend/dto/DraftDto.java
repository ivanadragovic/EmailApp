package com.mailApp.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DraftDto {
    private Integer id;
    private UserDto sender;
    private String subject;
    private String content;
    private List<UserDto> receivers;
}
