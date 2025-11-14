package gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "fichas_tecnicas")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FichaTecnica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String director;

    private String sinopsis;

    private Integer duracion;

    private String pais;

    public FichaTecnica(Long id, String director, Integer duracion, String pais) {
        this.id = id;
        this.director = director;
        this.duracion = duracion;
        this.pais = pais;
    }
}
