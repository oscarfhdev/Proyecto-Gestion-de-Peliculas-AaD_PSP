package gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "actores")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Actor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    // Relación 1:N con película
    @ManyToMany(mappedBy = "actores")
    private List<Pelicula> peliculas;

    public void addPelicula(Pelicula pelicula){
        peliculas.add(pelicula);
        pelicula.getActores().add(this);
    }
}
