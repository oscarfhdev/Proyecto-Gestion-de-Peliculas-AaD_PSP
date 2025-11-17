package gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "peliculas")
@Data  // ✅ Lombok genera getters, setters, toString, equals, hashCode
@AllArgsConstructor      // ✅ genera constructor con todos los campos
@NoArgsConstructor
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String titulo;

    private int duracion;              // minutos

    @Column(name = "fecha_estreno")
    private LocalDate fechaEstreno;

    private String sinopsis;

    private int puntuacion;

    @OneToOne
    @JoinColumn(name = "ficha_id")
    private FichaTecnica fichaTecnica;

    @ManyToOne
    @JoinColumn(name = "director_id")
    private Director director;

    @ManyToMany
    @JoinTable(
        name = "pelicula_actores", // nombre de la tabla intermedia
        joinColumns = @JoinColumn(name = "pelicula_id"), // FK de esta entidad
        inverseJoinColumns = @JoinColumn(name = "actor_id") // FK de la otra entidad
    )
    private List<Actor> actores;

    public void addActor(Actor actor){
        actores.add(actor);
        actor.getPeliculas().add(this);
    }

}
