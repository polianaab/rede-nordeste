package com.semeia_nordeste.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.semeia_nordeste.backend.dto.EntregadorRequest;
import com.semeia_nordeste.backend.dto.EntregadorResponse;
import com.semeia_nordeste.backend.service.EntregadorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class EntregadorController {

    private final EntregadorService entregadorService;

    public EntregadorController(EntregadorService entregadorService) {
        this.entregadorService = entregadorService;
    }

    // Público — qualquer pessoa se candidata como entregador
    @PostMapping("/entregadores/cadastrar")
    public ResponseEntity<EntregadorResponse> cadastrar(
            @Valid @RequestBody EntregadorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(EntregadorResponse.fromEntity(entregadorService.cadastrar(request)));
    }

    // Admin aprova entregador
    @PatchMapping("/admin/entregadores/{id}/aprovar")
    public ResponseEntity<Void> aprovar(@PathVariable Long id) {
        entregadorService.aprovar(id);
        return ResponseEntity.ok().build();
    }

    // Entregador altera própria disponibilidade
    @PatchMapping("/entregadores/{id}/disponibilidade")
    public ResponseEntity<Void> disponibilidade(
            @PathVariable Long id,
            @RequestParam boolean disponivel) {
        entregadorService.alterarDisponibilidade(id, disponivel);
        return ResponseEntity.ok().build();
    }
}