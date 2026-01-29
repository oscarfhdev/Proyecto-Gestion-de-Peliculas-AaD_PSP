package com.ofhcinema.GestionCine.repository;

import com.ofhcinema.GestionCine.domain.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioId(Long usuarioId);

    List<Venta> findByEstado(String estado);
}
