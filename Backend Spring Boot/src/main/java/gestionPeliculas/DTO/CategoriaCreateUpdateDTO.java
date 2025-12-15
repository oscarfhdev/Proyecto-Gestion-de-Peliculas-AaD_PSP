package gestionPeliculas.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaCreateUpdateDTO {

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    private String nombre;

}
