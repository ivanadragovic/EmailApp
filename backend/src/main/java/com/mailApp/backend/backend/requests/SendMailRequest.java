package com.mailApp.backend.backend.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SendMailRequest {
    private List<String> receiverUsernames;
    private String subject;
    private String content;
}
