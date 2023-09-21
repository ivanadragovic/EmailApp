package com.mailApp.backend.backend.repositories;

import com.mailApp.backend.backend.entities.Favorites;
import com.mailApp.backend.backend.entities.composite_keys.FavoritesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoritesRepository extends JpaRepository<Favorites, FavoritesId> {

    @Query("SELECT f FROM Favorites f WHERE f.user.username = :username")
    List<Favorites> findByUser(@Param("username") String username);

    @Query("SELECT f FROM Favorites f WHERE f.user.username = :username AND f.mail.id = :mailId")
    Favorites findByUserAndMailId(@Param("username") String username, @Param("mailId") Integer mailId);

    @Modifying
    @Query("DELETE FROM Favorites f WHERE f.user.username = :username AND f.mail.id = :mailId")
    void removeFavorite(@Param("username") String username, @Param("mailId") Integer mailId);
}
