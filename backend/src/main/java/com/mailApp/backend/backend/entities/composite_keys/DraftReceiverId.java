package com.mailApp.backend.backend.entities.composite_keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class DraftReceiverId implements Serializable{
    @Column(name = "username")
    private String username;
    @Column(name = "draft_id")
    private Integer draftId;
}
