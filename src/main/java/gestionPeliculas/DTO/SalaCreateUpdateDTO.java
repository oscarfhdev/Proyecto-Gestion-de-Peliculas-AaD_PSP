package gestionPeliculas.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalaCreateUpdateDTO {

    @NotNull(message = "El número de sala es obligatorio")
    private Long numeroSala;

    @NotNull(message = "La capacidad es obligatoria")
    @Positive(message = "La capacidad debe ser mayor que 0")
    private Long capacidad;
}
