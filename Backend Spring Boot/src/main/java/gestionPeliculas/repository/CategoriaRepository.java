package gestionPeliculas.repository;

import gestionPeliculas.domain.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    java.util.Optional<Categoria> findByNombre(String nombre);
}
