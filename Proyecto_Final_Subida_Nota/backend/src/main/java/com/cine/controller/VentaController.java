package com.cine.controller;

import com.cine.dto.venta.VentaInputDTO;
import com.cine.dto.venta.VentaOutputDTO;
import com.cine.servicio.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    /** ADMIN - Ver todas las ventas */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VentaOutputDTO>> getAll() {
        return ResponseEntity.ok(ventaService.findAll());
    }

    /** ADMIN - Ver detalle de cualquier venta */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VentaOutputDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.findById(id));
    }

    /** USER - Ver solo MIS ventas */
    @GetMapping("/mis-ventas")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<VentaOutputDTO>> getMisVentas() {
        return ResponseEntity.ok(ventaService.findMisVentas());
    }

    /** USER - Comprar entradas */
    @PostMapping("/comprar")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<VentaOutputDTO> comprar(@Valid @RequestBody VentaInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ventaService.comprar(dto));
    }

    /** USER - Cancelar MI venta */
    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<VentaOutputDTO> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.cancelar(id));
    }

    /** ADMIN - Eliminar venta */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ventaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
