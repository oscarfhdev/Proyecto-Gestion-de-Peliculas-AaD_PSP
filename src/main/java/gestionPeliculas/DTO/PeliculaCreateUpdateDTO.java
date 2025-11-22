package gestionPeliculas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaCreateUpdateDTO {
    private String titulo;
    private Integer duracion;
    private LocalDate fechaEstreno;
    private String sipnosis;
    private Integer valoracion;
}
