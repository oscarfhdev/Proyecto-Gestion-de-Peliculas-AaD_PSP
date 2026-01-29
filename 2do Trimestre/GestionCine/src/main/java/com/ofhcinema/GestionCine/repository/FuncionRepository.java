package com.ofhcinema.GestionCine.repository;

import com.ofhcinema.GestionCine.domain.Funcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FuncionRepository extends JpaRepository<Funcion, Long> {
    List<Funcion> findBySalaId(Long salaId);

    List<Funcion> findByPeliculaId(Long peliculaId);

    List<Funcion> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
}
