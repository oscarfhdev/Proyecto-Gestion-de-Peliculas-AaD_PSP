package com.cine.servicio;

import com.cine.dto.login.*;
import com.cine.modelo.RefreshToken;
import com.cine.modelo.Rol;
import com.cine.modelo.Usuario;
import com.cine.repositorio.RefreshTokenRepository;
import com.cine.repositorio.RolRepository;
import com.cine.repositorio.UsuarioRepository;
import com.cine.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponseDTO login(LoginRequestDTO req) {
        Usuario u = usuarioRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));
        if (!passwordEncoder.matches(req.password(), u.getPassword()))
            throw new BadCredentialsException("Credenciales inválidas");
        return generateAuthResponse(u, "Login exitoso");
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO req) {
        if (usuarioRepository.existsByEmail(req.email()))
            throw new RuntimeException("Ya existe un usuario con ese email");
        Rol rolUser = rolRepository.findByNombre("USER")
                .orElseThrow(() -> new RuntimeException("Rol USER no encontrado en la BBDD"));
        Usuario u = Usuario.builder()
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .nombre(req.nombre())
                .enabled(true)
                .roles(new HashSet<>(Set.of(rolUser)))
                .build();
        usuarioRepository.save(u);
        return generateAuthResponse(u, "Registro exitoso");
    }

    @Transactional
    public AuthResponseDTO refreshToken(RefreshTokenRequestDTO req) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> new RuntimeException("Refresh Token no encontrado o ya revocado"));
        if (storedToken.getFechaExpiracion().isBefore(Instant.now())) {
            refreshTokenRepository.delete(storedToken);
            throw new RuntimeException("Refresh Token expirado. Inicia sesión de nuevo.");
        }
        if (!jwtUtil.validateToken(req.refreshToken())) {
            refreshTokenRepository.delete(storedToken);
            throw new RuntimeException("Refresh Token inválido");
        }
        refreshTokenRepository.delete(storedToken);
        return generateAuthResponse(storedToken.getUsuario(), "Token renovado exitosamente");
    }

    private AuthResponseDTO generateAuthResponse(Usuario usuario, String message) {
        String accessToken = jwtUtil.generateAccessToken(usuario);
        String refreshTokenStr = jwtUtil.generateRefreshToken(usuario);
        refreshTokenRepository.deleteByUsuario(usuario);
        refreshTokenRepository.save(RefreshToken.builder()
                .token(refreshTokenStr)
                .usuario(usuario)
                .fechaExpiracion(Instant.now().plusMillis(jwtUtil.getRefreshTokenExpiration()))
                .build());
        Set<String> roles = usuario.getRoles().stream().map(Rol::getNombre).collect(Collectors.toSet());
        return new AuthResponseDTO(usuario.getEmail(), usuario.getNombre(), message, accessToken, refreshTokenStr, roles);
    }
}
