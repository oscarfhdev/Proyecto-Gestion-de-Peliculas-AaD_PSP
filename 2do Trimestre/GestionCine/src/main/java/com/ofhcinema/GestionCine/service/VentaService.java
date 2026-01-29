package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Usuario;
import com.ofhcinema.GestionCine.domain.Venta;
import com.ofhcinema.GestionCine.dto.create.VentaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.VentaResponseDTO;
import com.ofhcinema.GestionCine.mapper.VentaMapper;
import com.ofhcinema.GestionCine.repository.UsuarioRepository;
import com.ofhcinema.GestionCine.repository.VentaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VentaService {

    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaMapper ventaMapper;

    public VentaResponseDTO create(VentaCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + dto.getUsuarioId()));

        Venta venta = ventaMapper.toEntity(dto);
        venta.setUsuario(usuario);

        venta = ventaRepository.save(venta);
        return ventaMapper.toResponseDTO(venta);
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> findAll() {
        return ventaMapper.toResponseDTOList(ventaRepository.findAll());
    }

    @Transactional(readOnly = true)
    public VentaResponseDTO findById(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada con id: " + id));
        return ventaMapper.toResponseDTO(venta);
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> findByUsuarioId(Long usuarioId) {
        return ventaMapper.toResponseDTOList(ventaRepository.findByUsuarioId(usuarioId));
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> findByEstado(String estado) {
        return ventaMapper.toResponseDTOList(ventaRepository.findByEstado(estado));
    }

    public VentaResponseDTO update(Long id, VentaCreateDTO dto) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada con id: " + id));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + dto.getUsuarioId()));

        venta.setFecha(dto.getFecha());
        venta.setImporteTotal(dto.getImporteTotal());
        venta.setMetodoPago(dto.getMetodoPago());
        venta.setEstado(dto.getEstado());
        venta.setUsuario(usuario);

        venta = ventaRepository.save(venta);
        return ventaMapper.toResponseDTO(venta);
    }

    public void delete(Long id) {
        if (!ventaRepository.existsById(id)) {
            throw new EntityNotFoundException("Venta no encontrada con id: " + id);
        }
        ventaRepository.deleteById(id);
    }
}
