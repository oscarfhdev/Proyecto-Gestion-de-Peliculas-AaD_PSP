package com.cine.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public record UsuarioInputDTO(
        @Email(message = "El formato del email no es válido")
        @NotBlank(message = "El email no puede estar vacío")
        String email, String password, String nombre, Set<String> roles) {}
