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

    @Column(nullable = false)
    private String nombre;

    private String apellido;

    @Column(name = "foto_url")
    private String fotoUrl;

    // Relación N:M con película
    @ManyToMany(mappedBy = "actores")
    @JsonIgnore
    private List<Pelicula> peliculas = new ArrayList<>();

    public void addPelicula(Pelicula pelicula) {
        peliculas.add(pelicula);
        pelicula.getActores().add(this);
    }

    // Método helper para nombre completo
    public String getNombreCompleto() {
        if (apellido != null && !apellido.isBlank()) {
            return nombre + " " + apellido;
        }
        return nombre;
    }
}
