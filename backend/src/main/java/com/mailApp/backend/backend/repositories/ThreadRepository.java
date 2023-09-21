package com.mailApp.backend.backend.repositories;

import com.mailApp.backend.backend.entities.MailThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThreadRepository extends JpaRepository<MailThread, Integer> {
    List<MailThread> findByMailId(Integer mailId);
}
