package com.mailApp.backend.backend.entities;

import com.mailApp.backend.backend.entities.composite_keys.FavoritesId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "favorites")
public class Favorites implements Serializable {
    @EmbeddedId
    private FavoritesId id;
    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("username")
    @JoinColumn(name = "username")
    private User user;
    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("mailId")
    @JoinColumn(name = "mail_id")
    private Mail mail;
}
