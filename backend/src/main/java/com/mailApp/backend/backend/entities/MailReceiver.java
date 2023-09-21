package com.mailApp.backend.backend.entities;

import com.mailApp.backend.backend.entities.composite_keys.MailReceiverId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mail_receiver")
public class MailReceiver implements Serializable {
    @EmbeddedId
    private MailReceiverId id;
    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("username")
    @JoinColumn(name = "username")
    private User receiver;
    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("mailId")
    @JoinColumn(name = "mail_id")
    private Mail mail;
    @Column(name = "is_new")
    private Boolean isNew;
}
