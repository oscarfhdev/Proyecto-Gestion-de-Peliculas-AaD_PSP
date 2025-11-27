package gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "plataformas")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Plataforma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String url;

    @ManyToMany(mappedBy = "plataformas")
    private List<Pelicula> peliculas;

}