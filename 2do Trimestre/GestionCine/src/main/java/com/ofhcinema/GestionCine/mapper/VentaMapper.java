package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Venta;
import com.ofhcinema.GestionCine.dto.create.VentaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.VentaResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VentaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "entradas", ignore = true)
    Venta toEntity(VentaCreateDTO dto);

    @Mapping(source = "usuario.email", target = "usuarioEmail")
    VentaResponseDTO toResponseDTO(Venta entity);

    List<VentaResponseDTO> toResponseDTOList(List<Venta> entities);
}
