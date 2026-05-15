package com.cine.repositorio;

import com.cine.modelo.Butaca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ButacaRepository extends JpaRepository<Butaca, Long> {
    List<Butaca> findBySalaId(Long salaId);
    List<Butaca> findBySalaIdOrderByFilaAscNumeroAsc(Long salaId);
}
