package gestionPeliculas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FuncionDTO {

    private Long id;
    private LocalDate fecha;
    private LocalTime hora;
    private Double precio;
    private String formato;
    private PeliculaDTO pelicula;
    private SalaDTO sala;

}
