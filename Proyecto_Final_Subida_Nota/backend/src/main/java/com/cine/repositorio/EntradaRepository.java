package com.cine.repositorio;

import com.cine.modelo.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {
    List<Entrada> findByFuncionId(Long funcionId);
}
