package com.ofhcinema.GestionCine.repository;

import com.ofhcinema.GestionCine.domain.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {
    List<Entrada> findByVentaId(Long ventaId);

    List<Entrada> findByFuncionId(Long funcionId);

    Optional<Entrada> findByCodigo(String codigo);

    boolean existsByFuncionIdAndFilaAndAsiento(Long funcionId, Integer fila, Integer asiento);
}
