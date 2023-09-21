package com.mailApp.backend.backend.repositories;

import com.mailApp.backend.backend.entities.DraftReceiver;
import com.mailApp.backend.backend.entities.composite_keys.DraftReceiverId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DraftReceiverRepository extends JpaRepository<DraftReceiver, DraftReceiverId> {
    @Query("SELECT dr FROM DraftReceiver dr WHERE dr.receiver.username = :username")
    List<DraftReceiver> findDraftsByReceiver(@Param("username") String username);
    List<DraftReceiver> findByDraftId(Integer draftId);

    @Modifying
    @Query("DELETE FROM DraftReceiver dr WHERE dr.draft.id = :draftId")
    void deleteDraftReceivers(@Param("draftId") Integer draftId);
}
