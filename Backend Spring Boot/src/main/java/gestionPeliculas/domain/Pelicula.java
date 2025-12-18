package gestionPeliculas.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "peliculas")
@Data // ✅ Lombok genera getters, setters, toString, equals, hashCode
@NoArgsConstructor
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String titulo;

    private int duracion; // minutos

    @Column(name = "fecha_estreno")
    private LocalDate fechaEstreno;

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(columnDefinition = "TEXT")
    private String sinopsis;

    private int valoracion;

    @ManyToOne
    @JoinColumn(name = "director_id")

    private Director director;

    @ManyToMany
    @JsonIgnore
    @JoinTable(name = "pelicula_actores", // nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "pelicula_id"), // FK de esta entidad
            inverseJoinColumns = @JoinColumn(name = "actor_id") // FK de la otra entidad
    )
    private List<Actor> actores = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "peliculas_categorias", joinColumns = @JoinColumn(name = "pelicula_id"), inverseJoinColumns = @JoinColumn(name = "categoria_id"))
    private List<Categoria> categorias = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "peliculas_idiomas", joinColumns = @JoinColumn(name = "pelicula_id"), inverseJoinColumns = @JoinColumn(name = "idioma_id"))
    private List<Idioma> idiomas = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "peliculas_plataformas", joinColumns = @JoinColumn(name = "pelicula_id"), inverseJoinColumns = @JoinColumn(name = "plataforma_id"))
    private List<Plataforma> plataformas = new ArrayList<>();

    @OneToMany(mappedBy = "pelicula", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Funcion> funciones = new ArrayList<>();

    @OneToMany(mappedBy = "pelicula", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Critica> criticas = new ArrayList<>();

    // Helpers
    public void addActor(Actor actor) {
        actores.add(actor);
        actor.getPeliculas().add(this);
    }

    public void addCategoria(Categoria categoria) {
        categorias.add(categoria);
        categoria.getPeliculas().add(this);
    }

    public void addIdioma(Idioma idioma) {
        idiomas.add(idioma);
        idioma.getPeliculas().add(this);
    }

    public void addPlataforma(Plataforma plataforma) {
        plataformas.add(plataforma);
        plataforma.getPeliculas().add(this);
    }

}
