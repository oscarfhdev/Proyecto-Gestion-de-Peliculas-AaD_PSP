package com.ofhcinema.GestionCine.repository;

import com.ofhcinema.GestionCine.domain.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    Optional<Pelicula> findByTitulo(String titulo);

    List<Pelicula> findByDirectorId(Long directorId);
}
