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
@Table(name = "directores")
public class Director {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String apellido;

    @Column(name = "foto_url")
    private String fotoUrl;

    // Relación 1:N con película
    @OneToMany(mappedBy = "director")
    @JsonIgnore
    private List<Pelicula> peliculas = new ArrayList<>();

    // Método helper para nombre completo
    public String getNombreCompleto() {
        if (apellido != null && !apellido.isBlank()) {
            return nombre + " " + apellido;
        }
        return nombre;
    }
}
