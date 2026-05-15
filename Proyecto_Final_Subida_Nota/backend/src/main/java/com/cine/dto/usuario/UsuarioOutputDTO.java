package com.cine.dto.usuario;

import java.util.Set;

public record UsuarioOutputDTO(Long id, String email, String nombre, boolean enabled, Set<String> roles) {}
