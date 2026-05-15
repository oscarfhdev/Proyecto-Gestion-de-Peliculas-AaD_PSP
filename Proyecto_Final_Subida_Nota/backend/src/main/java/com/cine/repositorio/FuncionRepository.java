package com.cine.repositorio;

import com.cine.modelo.Funcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FuncionRepository extends JpaRepository<Funcion, Long> {
    List<Funcion> findByPeliculaId(Long peliculaId);
    List<Funcion> findBySalaId(Long salaId);
}
