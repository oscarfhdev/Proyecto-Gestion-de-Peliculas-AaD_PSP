package gestionPeliculas.domain;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "salas")
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long numeroSala;

    private Long capacidad;

    @OneToMany(mappedBy = "sala")
    private List<Funcion> funciones = new ArrayList<>();
}
