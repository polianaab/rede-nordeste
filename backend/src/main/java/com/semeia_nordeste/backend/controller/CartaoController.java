package com.semeia_nordeste.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.semeia_nordeste.backend.dto.CartaoRequest;
import com.semeia_nordeste.backend.dto.CartaoResponse;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.service.CartaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios/cartoes")
public class CartaoController {

    private final CartaoService service;

    public CartaoController(CartaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CartaoResponse>> listar(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(service.listar(usuario).stream().map(CartaoResponse::fromEntity).toList());
    }

    @PostMapping
    public ResponseEntity<CartaoResponse> criar(
            @Valid @RequestBody CartaoRequest req,
            @AuthenticationPrincipal Usuario usuario) {
        var salvo = service.criar(req, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(CartaoResponse.fromEntity(salvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        service.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
