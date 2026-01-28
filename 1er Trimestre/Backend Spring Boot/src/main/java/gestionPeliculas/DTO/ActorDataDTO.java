package gestionPeliculas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO simple para recibir datos de actores desde TMDB
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActorDataDTO {
    private String nombre;
    private String apellido;
    private String fotoUrl;
}
