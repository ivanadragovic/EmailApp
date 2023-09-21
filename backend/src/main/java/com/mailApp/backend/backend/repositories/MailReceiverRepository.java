package com.mailApp.backend.backend.repositories;

import com.mailApp.backend.backend.entities.MailReceiver;
import com.mailApp.backend.backend.entities.composite_keys.MailReceiverId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MailReceiverRepository
        extends JpaRepository<MailReceiver, MailReceiverId> {

    @Query("SELECT mr FROM MailReceiver mr WHERE mr.receiver.username = :username")
    List<MailReceiver> findByReceiver(@Param("username") String username);
    List<MailReceiver> findByMailId(Integer mailId);
}
