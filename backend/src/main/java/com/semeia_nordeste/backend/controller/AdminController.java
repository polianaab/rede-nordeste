package com.semeia_nordeste.backend.controller;

import com.semeia_nordeste.backend.dto.CategoriaRequest;
import com.semeia_nordeste.backend.dto.CategoriaResponse;
import com.semeia_nordeste.backend.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CategoriaService categoriaService;

    public AdminController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaResponse> criarCategoria(
            @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CategoriaResponse.fromEntity(categoriaService.criar(request)));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaResponse>> listarCategorias() {
        return ResponseEntity.ok(
                categoriaService.listarTodas().stream()
                        .map(CategoriaResponse::fromEntity)
                        .toList());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard() {
        return ResponseEntity.ok("Bem-vinda, Admin! Painel liberado.");
    }
}