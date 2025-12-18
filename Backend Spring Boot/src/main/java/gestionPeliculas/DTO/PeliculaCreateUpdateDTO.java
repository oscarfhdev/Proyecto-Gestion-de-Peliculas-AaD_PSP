package gestionPeliculas.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaCreateUpdateDTO {

    @NotBlank(message = "El título es obligatorio, no puede estar vacío ni ser nulo") // No nulo + no vacío
    private String titulo;

    @NotNull(message = "La duración es obligatoria")
    private Integer duracion;

    @NotNull(message = "La fecha de estreno es obligatoria")
    private LocalDate fechaEstreno;

    @NotBlank(message = "La sinopsis es obligatoria, no puede estar vacía ni ser nula")
    private String sinopsis;

    @NotNull(message = "La valoración es obligatoria")
    private Integer valoracion;

    private String posterUrl;

    // Recibimos solo los IDs
    private Long directorId;

    // El resto N a M (listas de IDs)
    private List<Long> actorIds;
    private List<Long> categoriaIds;
    private List<Long> idiomaIds;
    private List<Long> plataformaIds;

    private String directorNombre;
    private String directorFotoUrl;
    private List<String> actoresNombres;
    private List<ActorDataDTO> actoresData; // Actores con foto desde TMDB
    private List<String> categoriasNombres;
    private List<String> idiomasNombres;
    private List<String> plataformasNombres;
}
