package com.mailApp.backend.backend.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SaveDraftRequest {
    private Integer id;
    private String subject;
    private String content;
    private List<String> receiverUsernames;
}
