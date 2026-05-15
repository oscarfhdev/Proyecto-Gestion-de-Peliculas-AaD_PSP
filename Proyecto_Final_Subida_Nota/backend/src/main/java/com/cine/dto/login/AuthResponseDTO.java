package com.cine.dto.login;

import java.util.Set;

public record AuthResponseDTO(
        String email,
        String nombre,
        String message,
        String accessToken,
        String refreshToken,
        Set<String> roles
) {}
