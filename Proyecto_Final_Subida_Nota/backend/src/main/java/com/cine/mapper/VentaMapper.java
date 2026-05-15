package com.cine.mapper;

import com.cine.dto.venta.VentaInputDTO;
import com.cine.dto.venta.VentaOutputDTO;
import com.cine.modelo.Venta;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {EntradaMapper.class})
public interface VentaMapper {
    @Mapping(target = "usuarioId", source = "usuario.id")
    VentaOutputDTO toDTO(Venta venta);

    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fecha", ignore = true)
    @Mapping(target = "importeTotal", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "creadoPor", ignore = true)
    @Mapping(target = "entradas", ignore = true)
    Venta toEntity(VentaInputDTO ventaInputDTO);
}
