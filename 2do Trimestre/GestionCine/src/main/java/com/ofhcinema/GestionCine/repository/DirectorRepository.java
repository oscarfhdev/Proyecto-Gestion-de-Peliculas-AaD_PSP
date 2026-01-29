package com.ofhcinema.GestionCine.repository;

import com.ofhcinema.GestionCine.domain.Director;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DirectorRepository extends JpaRepository<Director, Long> {
    Optional<Director> findByNombre(String nombre);
}
