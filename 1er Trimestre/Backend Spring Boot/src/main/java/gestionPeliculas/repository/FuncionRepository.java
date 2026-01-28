package gestionPeliculas.repository;

import gestionPeliculas.domain.Funcion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionRepository extends JpaRepository<Funcion, Long> {
}
