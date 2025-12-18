package gestionPeliculas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectorDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String nombreCompleto;
    private String fotoUrl;
    private int numeroPeliculas;
}
