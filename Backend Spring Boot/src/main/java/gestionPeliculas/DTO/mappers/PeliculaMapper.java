package gestionPeliculas.DTO.mappers;

import gestionPeliculas.domain.Pelicula;
import gestionPeliculas.DTO.PeliculaCreateUpdateDTO;
import gestionPeliculas.DTO.PeliculaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PeliculaMapper {

    // Inyectamos los otros mappers para que nos ayuden con las relaciones
    @Autowired
    private DirectorMapper directorMapper;

    @Autowired
    private ActorMapper actorMapper;

    @Autowired
    private CategoriaMapper categoriaMapper;

    @Autowired
    private IdiomaMapper idiomaMapper;

    @Autowired
    private PlataformaMapper plataformaMapper;

    // ENTITY -> DTO
    public PeliculaDTO toDto(Pelicula pelicula) {
        if (pelicula == null) return null;

        return new PeliculaDTO(
                pelicula.getId(),
                pelicula.getTitulo(),
                pelicula.getDuracion(),
                pelicula.getFechaEstreno(),
                pelicula.getSinopsis(),
                pelicula.getValoracion(),
                pelicula.getPosterUrl(), // <--- AÑADE ESTO AQUÍ (respeta el orden del constructor del DTO)
                // Convertimos el Director (entidad) a DirectorDTO
                directorMapper.toDto(pelicula.getDirector()),
                // Convertimos las listas usando streams y los mappers correspondientes
                pelicula.getActores().stream().map(actorMapper::toDto).toList(),
                pelicula.getCategorias().stream().map(categoriaMapper::toDto).toList(),
                pelicula.getIdiomas().stream().map(idiomaMapper::toDto).toList(),
                pelicula.getPlataformas().stream().map(plataformaMapper::toDto).toList()
        );
    }

    // DTO -> ENTITY (Para crear)
    // NOTA: Aquí SOLO mapeamos los datos básicos.
    // Las relaciones (IDs) ya las  con el método 'asignarRelaciones',
    public Pelicula toEntity(PeliculaCreateUpdateDTO dto) {
        if (dto == null) return null;
        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(dto.getTitulo());
        pelicula.setDuracion(dto.getDuracion());
        pelicula.setFechaEstreno(dto.getFechaEstreno());
        pelicula.setSinopsis(dto.getSinopsis());
        pelicula.setValoracion(dto.getValoracion());
        return pelicula;
    }

    // UPDATE (Para actualizar)
    public void updateEntity(PeliculaCreateUpdateDTO dto, Pelicula pelicula) {
        if (dto == null || pelicula == null) return;

        pelicula.setTitulo(dto.getTitulo());
        pelicula.setDuracion(dto.getDuracion());
        pelicula.setFechaEstreno(dto.getFechaEstreno());
        pelicula.setSinopsis(dto.getSinopsis());
        pelicula.setValoracion(dto.getValoracion());
    }
}