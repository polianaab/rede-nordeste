package com.semeia_nordeste.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.semeia_nordeste.backend.dto.EnderecoRequest;
import com.semeia_nordeste.backend.dto.EnderecoResponse;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.service.EnderecoService;

import jakarta.validation.Valid;

/**
 * CRUD de endereços do usuário logado.
 *
 * Segurança: o service SEMPRE filtra por usuario.getId() do principal —
 * impossível listar/editar/deletar endereço de outro usuário, mesmo
 * trocando o ID na URL.
 */
@RestController
@RequestMapping("/api/usuarios/enderecos")
public class EnderecoController {

    private final EnderecoService service;

    public EnderecoController(EnderecoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EnderecoResponse>> listar(@AuthenticationPrincipal Usuario usuario) {
        List<EnderecoResponse> out = service.listar(usuario).stream()
                .map(EnderecoResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(out);
    }

    @PostMapping
    public ResponseEntity<EnderecoResponse> criar(
            @Valid @RequestBody EnderecoRequest req,
            @AuthenticationPrincipal Usuario usuario) {
        var salvo = service.criar(req, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(EnderecoResponse.fromEntity(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnderecoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody EnderecoRequest req,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(EnderecoResponse.fromEntity(service.atualizar(id, req, usuario)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        service.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
