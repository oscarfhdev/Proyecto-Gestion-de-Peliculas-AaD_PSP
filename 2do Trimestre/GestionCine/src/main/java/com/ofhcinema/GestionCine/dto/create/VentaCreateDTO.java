package com.ofhcinema.GestionCine.dto.create;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaCreateDTO {

    @NotNull(message = "La fecha es obligatoria")
    private LocalDateTime fecha;

    @NotNull(message = "El importe total es obligatorio")
    private BigDecimal importeTotal;

    @NotBlank(message = "El método de pago es obligatorio")
    private String metodoPago;

    @NotBlank(message = "El estado es obligatorio")
    private String estado;

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @NotEmpty(message = "Debe incluir al menos una entrada")
    @Valid
    private List<EntradaVentaDTO> entradas;

    /**
     * DTO simplificado para crear entradas dentro de una venta.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EntradaVentaDTO {
        @NotNull(message = "La fila es obligatoria")
        @Min(value = 1, message = "La fila debe ser al menos 1")
        private Integer fila;

        @NotNull(message = "El asiento es obligatorio")
        @Min(value = 1, message = "El asiento debe ser al menos 1")
        private Integer asiento;

        @NotNull(message = "El ID de la función es obligatorio")
        private Long funcionId;
    }
}
