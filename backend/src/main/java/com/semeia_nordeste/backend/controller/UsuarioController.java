package com.semeia_nordeste.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.semeia_nordeste.backend.config.TokenService;
import com.semeia_nordeste.backend.dto.AuthResponse;
import com.semeia_nordeste.backend.dto.LoginRequest;
import com.semeia_nordeste.backend.dto.RefreshRequest;
import com.semeia_nordeste.backend.dto.UsuarioRegistroRequest;
import com.semeia_nordeste.backend.dto.UsuarioResponse;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.UsuarioRepository;
import com.semeia_nordeste.backend.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody UsuarioRegistroRequest request) {
        Usuario salvo = service.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponse.fromEntity(salvo));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = service.autenticar(request.email(), request.senha());
        return ResponseEntity.ok(new AuthResponse(
                tokenService.gerarAccessToken(usuario),
                tokenService.gerarRefreshToken(usuario),
                usuario.getNomeCompleto(),
                usuario.getTipoPerfil()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        String email = tokenService.validarRefreshToken(request.refreshToken());
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return ResponseEntity.ok(new AuthResponse(
                tokenService.gerarAccessToken(usuario),
                tokenService.gerarRefreshToken(usuario),
                usuario.getNomeCompleto(),
                usuario.getTipoPerfil()));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(UsuarioResponse.fromEntity(usuario));
    }
}