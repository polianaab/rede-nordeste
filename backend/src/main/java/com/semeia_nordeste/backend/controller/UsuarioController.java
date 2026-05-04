package com.semeia_nordeste.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.semeia_nordeste.backend.config.TokenService;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.service.UsuarioService;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario salvo = service.registrar(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String senha = loginData.get("senha");

            Usuario usuarioAutenticado = service.autenticar(email, senha);

            String accessToken = tokenService.gerarAccessToken(usuarioAutenticado);
            String refreshToken = tokenService.gerarRefreshToken(usuarioAutenticado);

            return ResponseEntity.ok(Map.of(
                    "accessToken", accessToken,
                    "refreshToken", refreshToken,
                    "nome", usuarioAutenticado.getNomeCompleto(),
                    "perfil", usuarioAutenticado.getTipoPerfil()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}