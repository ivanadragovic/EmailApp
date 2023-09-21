package com.mailApp.backend.backend.entities;

import com.mailApp.backend.backend.dto.ThreadDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mail_thread")
public class MailThread {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mail_id", referencedColumnName = "id", nullable = false)
    private Mail mail;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "username", referencedColumnName = "username", nullable = false)
    private User user;
    @Column(nullable = false)
    private LocalDateTime dateTime;
    @Column(nullable = false)
    private String content;

    public ThreadDto toThreadDto() {
        return new ThreadDto(
                this.user.getUsername(),
                this.dateTime,
                this.content
        );
    }
}
