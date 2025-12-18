package gestionPeliculas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriticaDTO {
    private Long id;
    private String comentario;
    private Double nota;
    private LocalDate fecha;
    private String peliculaTitulo;
    private String autor;
}
