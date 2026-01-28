package gestionPeliculas.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectorCreateUpdateDTO {
    @NotBlank
    private String nombre;

    private String apellido;

    private String fotoUrl;
}