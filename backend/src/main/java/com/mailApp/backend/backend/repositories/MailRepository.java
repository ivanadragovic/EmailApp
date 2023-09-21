package com.mailApp.backend.backend.repositories;

import com.mailApp.backend.backend.entities.Mail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MailRepository
        extends JpaRepository<Mail, Integer> {

    @Query("SELECT m from Mail m WHERE m.sender.username = :username")
    List<Mail> findAllByUsername(@Param("username") String username);
}
