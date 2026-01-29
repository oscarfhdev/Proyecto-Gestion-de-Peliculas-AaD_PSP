package com.ofhcinema.GestionCine.dto.create;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntradaCreateDTO {

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotNull(message = "La fila es obligatoria")
    @Min(value = 1, message = "La fila debe ser al menos 1")
    private Integer fila;

    @NotNull(message = "El asiento es obligatorio")
    @Min(value = 1, message = "El asiento debe ser al menos 1")
    private Integer asiento;

    @NotBlank(message = "El estado es obligatorio")
    private String estado;

    @NotNull(message = "El ID de la venta es obligatorio")
    private Long ventaId;

    @NotNull(message = "El ID de la función es obligatorio")
    private Long funcionId;
}
