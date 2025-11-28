package gestionPeliculas.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "actores")
public class Actor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    // Relación 1:N con película
    @ManyToMany(mappedBy = "actores")
    @JsonIgnore
    private List<Pelicula> peliculas = new ArrayList<>();;

    public void addPelicula(Pelicula pelicula){
        peliculas.add(pelicula);
        pelicula.getActores().add(this);
    }
}
