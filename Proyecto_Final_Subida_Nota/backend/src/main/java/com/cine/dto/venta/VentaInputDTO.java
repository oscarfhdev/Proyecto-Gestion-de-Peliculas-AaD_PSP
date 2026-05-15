package com.cine.dto.venta;

import com.cine.dto.entrada.EntradaInputDTO;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public record VentaInputDTO(
        @NotBlank(message = "El método de pago es obligatorio") String metodoPago,
        Set<EntradaInputDTO> entradas) {}
