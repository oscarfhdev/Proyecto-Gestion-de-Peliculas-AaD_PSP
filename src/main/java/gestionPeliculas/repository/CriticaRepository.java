package gestionPeliculas.repository;

import gestionPeliculas.domain.Critica;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CriticaRepository extends JpaRepository<Critica, Long> {
}
