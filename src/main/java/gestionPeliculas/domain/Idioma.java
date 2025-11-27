package gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "idiomas")
@Data  // Lombok genera getters, setters, toString, equals, hashCode
@AllArgsConstructor      // Genera constructor con todos los campos
@NoArgsConstructor
public class Idioma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToMany(mappedBy = "idiomas")
    private List<Pelicula> peliculas;

}