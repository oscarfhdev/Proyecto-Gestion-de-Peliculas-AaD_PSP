package gestionPeliculas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalaDTO {

    private Long id;
    private Long numeroSala;
    private Long capacidad;
}
