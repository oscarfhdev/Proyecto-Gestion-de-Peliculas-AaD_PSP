package gestionPeliculas.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "criticas")
public class Critica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comentario;

    private Double nota;

    private LocalDate fecha;

    private String autor;

    @ManyToOne
    @JoinColumn(name = "pelicula_id")
    private Pelicula pelicula;


}