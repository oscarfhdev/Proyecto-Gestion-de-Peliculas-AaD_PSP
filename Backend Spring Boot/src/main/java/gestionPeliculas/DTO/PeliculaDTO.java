package gestionPeliculas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaDTO {
    private Long id;
    private String titulo;
    private Integer duracion;
    private LocalDate fechaEstreno;
    private String sinopsis;
    private Integer valoracion;

    private DirectorDTO director;
    private List<ActorDTO> actores;
    private List<CategoriaDTO> categorias;
    private List<IdiomaDTO> idiomas;
    private List<PlataformaDTO> plataformas;
}
