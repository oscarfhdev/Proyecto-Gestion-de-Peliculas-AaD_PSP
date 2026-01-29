package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Entrada;
import com.ofhcinema.GestionCine.domain.Funcion;
import com.ofhcinema.GestionCine.domain.Venta;
import com.ofhcinema.GestionCine.dto.create.EntradaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.EntradaResponseDTO;
import com.ofhcinema.GestionCine.mapper.EntradaMapper;
import com.ofhcinema.GestionCine.repository.EntradaRepository;
import com.ofhcinema.GestionCine.repository.FuncionRepository;
import com.ofhcinema.GestionCine.repository.VentaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EntradaService {

    private final EntradaRepository entradaRepository;
    private final VentaRepository ventaRepository;
    private final FuncionRepository funcionRepository;
    private final EntradaMapper entradaMapper;

    public EntradaResponseDTO create(EntradaCreateDTO dto) {
        Venta venta = ventaRepository.findById(dto.getVentaId())
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada con id: " + dto.getVentaId()));

        Funcion funcion = funcionRepository.findById(dto.getFuncionId())
                .orElseThrow(() -> new EntityNotFoundException("Función no encontrada con id: " + dto.getFuncionId()));

        // Verificar que el asiento no esté ocupado
        if (entradaRepository.existsByFuncionIdAndFilaAndAsiento(dto.getFuncionId(), dto.getFila(), dto.getAsiento())) {
            throw new IllegalStateException("El asiento ya está ocupado para esta función");
        }

        Entrada entrada = entradaMapper.toEntity(dto);
        entrada.setVenta(venta);
        entrada.setFuncion(funcion);

        entrada = entradaRepository.save(entrada);
        return entradaMapper.toResponseDTO(entrada);
    }

    @Transactional(readOnly = true)
    public List<EntradaResponseDTO> findAll() {
        return entradaMapper.toResponseDTOList(entradaRepository.findAll());
    }

    @Transactional(readOnly = true)
    public EntradaResponseDTO findById(Long id) {
        Entrada entrada = entradaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entrada no encontrada con id: " + id));
        return entradaMapper.toResponseDTO(entrada);
    }

    @Transactional(readOnly = true)
    public EntradaResponseDTO findByCodigo(String codigo) {
        Entrada entrada = entradaRepository.findByCodigo(codigo)
                .orElseThrow(() -> new EntityNotFoundException("Entrada no encontrada con código: " + codigo));
        return entradaMapper.toResponseDTO(entrada);
    }

    @Transactional(readOnly = true)
    public List<EntradaResponseDTO> findByVentaId(Long ventaId) {
        return entradaMapper.toResponseDTOList(entradaRepository.findByVentaId(ventaId));
    }

    @Transactional(readOnly = true)
    public List<EntradaResponseDTO> findByFuncionId(Long funcionId) {
        return entradaMapper.toResponseDTOList(entradaRepository.findByFuncionId(funcionId));
    }

    public EntradaResponseDTO update(Long id, EntradaCreateDTO dto) {
        Entrada entrada = entradaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entrada no encontrada con id: " + id));

        Venta venta = ventaRepository.findById(dto.getVentaId())
                .orElseThrow(() -> new EntityNotFoundException("Venta no encontrada con id: " + dto.getVentaId()));

        Funcion funcion = funcionRepository.findById(dto.getFuncionId())
                .orElseThrow(() -> new EntityNotFoundException("Función no encontrada con id: " + dto.getFuncionId()));

        entrada.setCodigo(dto.getCodigo());
        entrada.setFila(dto.getFila());
        entrada.setAsiento(dto.getAsiento());
        entrada.setEstado(dto.getEstado());
        entrada.setVenta(venta);
        entrada.setFuncion(funcion);

        entrada = entradaRepository.save(entrada);
        return entradaMapper.toResponseDTO(entrada);
    }

    public void delete(Long id) {
        if (!entradaRepository.existsById(id)) {
            throw new EntityNotFoundException("Entrada no encontrada con id: " + id);
        }
        entradaRepository.deleteById(id);
    }
}
