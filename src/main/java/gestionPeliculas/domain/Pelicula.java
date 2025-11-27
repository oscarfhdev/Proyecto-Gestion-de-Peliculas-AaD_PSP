package gestionPeliculas.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    private int valoracion;

    @OneToOne
    @JoinColumn(name = "ficha_id")
    private FichaTecnica fichaTecnica;

    @ManyToOne
    @JoinColumn(name = "director_id")
    private Director director;

    @ManyToMany
    @JsonIgnore
    @JoinTable(
        name = "pelicula_actores", // nombre de la tabla intermedia
        joinColumns = @JoinColumn(name = "pelicula_id"), // FK de esta entidad
        inverseJoinColumns = @JoinColumn(name = "actor_id") // FK de la otra entidad
    )
    private List<Actor> actores;

    @ManyToMany
    @JoinTable(
            name = "peliculas_categorias",
            joinColumns = @JoinColumn(name = "pelicula_id"),
            inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private List<Categoria> categorias;

    @ManyToMany
    @JoinTable(
            name = "peliculas_idiomas",
            joinColumns = @JoinColumn(name = "pelicula_id"),
            inverseJoinColumns = @JoinColumn(name = "idioma_id")
    )
    private List<Idioma> idiomas;

    @ManyToMany
    @JoinTable(
            name = "peliculas_plataformas",
            joinColumns = @JoinColumn(name = "pelicula_id"),
            inverseJoinColumns = @JoinColumn(name = "plataforma_id")
    )
    private List<Plataforma> plataformas;

    @OneToMany(mappedBy = "pelicula")
    private List<Critica> criticas;

    // Helpers
    public void addActor(Actor actor){
        actores.add(actor);
        actor.getPeliculas().add(this);
    }

    public void addCategoria(Categoria categoria){
        categorias.add(categoria);
        categoria.getPeliculas().add(this);
    }

    public void addIdioma(Idioma idioma){
        idiomas.add(idioma);
        idioma.getPeliculas().add(this);
    }
}
