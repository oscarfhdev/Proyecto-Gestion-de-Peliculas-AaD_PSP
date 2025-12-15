package gestionPeliculas.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriticaCreateUpdateDTO {

    @NotBlank(message = "El comentario es obligatorio")
    private String comentario;

    @NotNull(message = "La nota es obligatoria")
    @PositiveOrZero(message = "La nota no puede ser negativa")
    private Double nota;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

//    @NotNull(message = "La película es obligatoria")
//    private Long peliculaId;
//
//    @NotNull(message = "El usuario es obligatorio")
//    private Long usuarioId;
}
