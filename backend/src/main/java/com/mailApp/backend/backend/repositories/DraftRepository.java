package com.mailApp.backend.backend.repositories;

import com.mailApp.backend.backend.entities.Draft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DraftRepository extends JpaRepository<Draft, Integer> {
    @Query("SELECT d from Draft d WHERE d.sender.username = :username")
    List<Draft> findAllDraftsByUsername(@Param("username") String username);

    @Modifying
    @Query("DELETE FROM Draft d WHERE d.id = :draftId")
    void deleteDraftById(@Param("draftId") Integer draftId);
}
