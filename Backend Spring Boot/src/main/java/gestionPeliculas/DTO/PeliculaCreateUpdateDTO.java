package gestionPeliculas.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaCreateUpdateDTO {

    @NotBlank(message = "El título es obligatorio, no puede estar vacío ni ser nulo")  // No nulo + no vacío
    private String titulo;

    @NotNull(message = "La duración es obligatoria")
    private Integer duracion;

    @NotNull(message = "La fecha de estreno es obligatoria")
    private LocalDate fechaEstreno;

    @NotBlank(message = "La sinopsis es obligatoria, no puede estar vacía ni ser nula")
    private String sinopsis;

    @NotNull(message = "La valoración es obligatoria")
    private Integer valoracion;
}
