package gestionPeliculas.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActorCreateUpdateDTO {
    @NotBlank(message = "El nombre del actor es obligatorio")
    private String nombre;
}
