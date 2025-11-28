package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.SalaCreateUpdateDTO;
import gestionPeliculas.DTO.SalaDTO;
import gestionPeliculas.domain.Sala;
import org.springframework.stereotype.Component;

@Component
public class SalaMapper {

    public SalaDTO toDto(Sala sala) {
        return new SalaDTO(
                sala.getId(),
                sala.getNumeroSala(),
                sala.getCapacidad()
        );
    }

    public Sala toEntity(SalaCreateUpdateDTO dto) {
        Sala sala = new Sala();
        sala.setNumeroSala(dto.getNumeroSala());
        sala.setCapacidad(dto.getCapacidad());
        return sala;
    }

    public void updateEntity(SalaCreateUpdateDTO dto, Sala sala) {
        sala.setNumeroSala(dto.getNumeroSala());
        sala.setCapacidad(dto.getCapacidad());
    }
}
