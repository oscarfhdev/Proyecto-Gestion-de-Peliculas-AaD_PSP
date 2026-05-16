package com.cine.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestSecurityController {
    @GetMapping("/publico")
    public String publico() { return "Endpoint público - Acceso libre."; }
    @GetMapping("/privado")
    public String privado() { return "Endpoint privado - Solo con token."; }
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String soloAdmin() { return "Endpoint ADMIN - Solo con rol ADMIN."; }
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public String soloUser() { return "Endpoint USER - Solo con rol USER."; }
}
