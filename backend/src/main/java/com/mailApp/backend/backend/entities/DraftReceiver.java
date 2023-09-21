package com.mailApp.backend.backend.entities;

import com.mailApp.backend.backend.entities.composite_keys.DraftReceiverId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "draft_receiver")
public class DraftReceiver implements Serializable {
    @EmbeddedId
    private DraftReceiverId id;
    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("username")
    @JoinColumn(name = "username")
    private User receiver;
    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("draftId")
    @JoinColumn(name = "draft_id")
    private Draft draft;
}
