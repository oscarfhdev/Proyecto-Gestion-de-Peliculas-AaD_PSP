package gestionPeliculas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlataformaDTO {
    private Long id;
    private String nombre;
    private String url; // URL del logo
    private int numeroPeliculas;
}
