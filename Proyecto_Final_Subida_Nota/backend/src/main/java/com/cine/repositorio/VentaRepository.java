package com.cine.repositorio;

import com.cine.modelo.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioId(Long usuarioId);
    List<Venta> findByUsuarioEmail(String email);
}
