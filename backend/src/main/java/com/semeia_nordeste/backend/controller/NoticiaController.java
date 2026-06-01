package com.semeia_nordeste.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.semeia_nordeste.backend.dto.NoticiaResponse;
import com.semeia_nordeste.backend.service.NoticiaService;

@RestController
@RequestMapping("/api/noticias")
public class NoticiaController {

    private final NoticiaService noticiaService;

    public NoticiaController(NoticiaService noticiaService) {
        this.noticiaService = noticiaService;
    }

    // Público
    @GetMapping
    public ResponseEntity<Page<NoticiaResponse>> listar(
            @PageableDefault(size = 12, sort = "dataCriacao") Pageable pageable) {
        return ResponseEntity.ok(noticiaService.listarPublicas(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticiaResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(noticiaService.buscarPorId(id));
    }
}
