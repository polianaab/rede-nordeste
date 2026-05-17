package com.semeia_nordeste.backend.controller;

import com.semeia_nordeste.backend.dto.ReceitaRequest;
import com.semeia_nordeste.backend.dto.ReceitaResponse;
import com.semeia_nordeste.backend.service.ReceitaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReceitaController {

    private final ReceitaService receitaService;

    public ReceitaController(ReceitaService receitaService) {
        this.receitaService = receitaService;
    }

    // Produtor/Admin cria receita
    @PostMapping("/produtor/receitas")
    public ResponseEntity<ReceitaResponse> criar(
            @Valid @RequestBody ReceitaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ReceitaResponse.fromEntity(receitaService.criar(request)));
    }

    // Produtor/Admin edita receita
    @PutMapping("/produtor/receitas/{id}")
    public ResponseEntity<ReceitaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ReceitaRequest request) {
        return ResponseEntity.ok(
                ReceitaResponse.fromEntity(receitaService.atualizar(id, request)));
    }

    // Produtor/Admin deleta receita
    @DeleteMapping("/produtor/receitas/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        receitaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // Público — lista/busca receitas
    @GetMapping("/receitas")
    public ResponseEntity<Page<ReceitaResponse>> buscar(
            @RequestParam(required = false) String titulo,
            @PageableDefault(size = 12, sort = "dataCriacao") Pageable pageable) {
        return ResponseEntity.ok(
                receitaService.buscar(titulo, pageable)
                        .map(ReceitaResponse::fromEntity));
    }

    // Público — detalhe de uma receita
    @GetMapping("/receitas/{id}")
    public ResponseEntity<ReceitaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(
                ReceitaResponse.fromEntity(receitaService.buscarPorId(id)));
    }

    // Produtor vê suas próprias receitas
    @GetMapping("/produtor/receitas")
    public ResponseEntity<Page<ReceitaResponse>> minhas(
            @PageableDefault(size = 12, sort = "dataCriacao") Pageable pageable) {
        return ResponseEntity.ok(
                receitaService.listarMinhas(pageable)
                        .map(ReceitaResponse::fromEntity));
    }
}