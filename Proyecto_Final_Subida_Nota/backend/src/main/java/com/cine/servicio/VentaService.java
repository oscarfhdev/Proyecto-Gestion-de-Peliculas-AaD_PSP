package com.cine.servicio;

import com.cine.dto.entrada.EntradaInputDTO;
import com.cine.dto.venta.VentaInputDTO;
import com.cine.dto.venta.VentaOutputDTO;
import com.cine.mapper.VentaMapper;
import com.cine.modelo.*;
import com.cine.repositorio.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;
    private final FuncionRepository funcionRepository;
    private final EntradaRepository entradaRepository;
    private final VentaMapper ventaMapper;

    public List<VentaOutputDTO> findAll() {
        return ventaRepository.findAll().stream().map(ventaMapper::toDTO).collect(Collectors.toList());
    }

    public VentaOutputDTO findById(Long id) {
        return ventaRepository.findById(id).map(ventaMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + id));
    }

    /** Devuelve SOLO las ventas del usuario autenticado */
    public List<VentaOutputDTO> findMisVentas() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ventaRepository.findByUsuarioEmail(email).stream()
                .map(ventaMapper::toDTO).collect(Collectors.toList());
    }

    /** Compra de entradas: crea la venta vinculada al usuario autenticado */
    @Transactional
    public VentaOutputDTO comprar(VentaInputDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setMetodoPago(dto.metodoPago());
        venta.setEstado("COMPLETADA");

        Set<Entrada> entradas = new HashSet<>();
        double total = 0;

        if (dto.entradas() != null) {
            for (EntradaInputDTO entradaDTO : dto.entradas()) {
                Funcion funcion = funcionRepository.findById(entradaDTO.funcionId())
                        .orElseThrow(() -> new RuntimeException("Función no encontrada con ID: " + entradaDTO.funcionId()));

                // Verificar asiento disponible
                boolean ocupado = entradaRepository.findByFuncionId(funcion.getId()).stream()
                        .anyMatch(e -> e.getFila() == entradaDTO.fila()
                                && e.getAsiento() == entradaDTO.asiento()
                                && e.getEstado() != EstadoEntrada.CANCELADA);
                if (ocupado) {
                    throw new RuntimeException("Asiento " + entradaDTO.fila() + "-" + entradaDTO.asiento() + " ya ocupado");
                }

                Entrada entrada = Entrada.builder()
                        .fila(entradaDTO.fila())
                        .asiento(entradaDTO.asiento())
                        .funcion(funcion)
                        .venta(venta)
                        .estado(EstadoEntrada.VENDIDA)
                        .codigo(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                        .build();
                entradas.add(entrada);
                total += funcion.getPrecio();
            }
        }

        venta.setEntradas(entradas);
        venta.setImporteTotal(total);
        return ventaMapper.toDTO(ventaRepository.save(venta));
    }

    /** Cancelar venta: solo si pertenece al usuario autenticado */
    @Transactional
    public VentaOutputDTO cancelar(Long ventaId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + ventaId));

        if (!venta.getUsuario().getEmail().equals(email)) {
            throw new RuntimeException("No puedes cancelar una venta que no es tuya");
        }

        venta.setEstado("CANCELADA");
        venta.getEntradas().forEach(e -> e.setEstado(EstadoEntrada.CANCELADA));
        return ventaMapper.toDTO(ventaRepository.save(venta));
    }

    public void deleteById(Long id) {
        if (!ventaRepository.existsById(id))
            throw new RuntimeException("Venta no encontrada con ID: " + id);
        ventaRepository.deleteById(id);
    }
}
