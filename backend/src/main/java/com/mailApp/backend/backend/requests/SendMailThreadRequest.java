package com.mailApp.backend.backend.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SendMailThreadRequest {
    private Integer mailId;
    private String content;
}
