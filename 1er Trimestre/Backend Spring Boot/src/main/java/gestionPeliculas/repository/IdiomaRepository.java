package gestionPeliculas.repository;

import gestionPeliculas.domain.Idioma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IdiomaRepository extends JpaRepository<Idioma, Long> {
    Optional<Idioma> findByNombre(String nombre);
}
