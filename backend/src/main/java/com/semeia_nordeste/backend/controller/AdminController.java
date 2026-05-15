package com.semeia_nordeste.backend.controller;

import com.semeia_nordeste.backend.dto.CategoriaRequest;
import com.semeia_nordeste.backend.dto.CategoriaResponse;
import com.semeia_nordeste.backend.model.Categoria;
import com.semeia_nordeste.backend.repository.CategoriaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Rota para o Admin cadastrar novas categorias.
     */
    @PostMapping("/categorias")
    public ResponseEntity<CategoriaResponse> criarCategoria(@RequestBody @Valid CategoriaRequest request) {
        Categoria novaCategoria = new Categoria();
        novaCategoria.setNome(request.nome());
        novaCategoria.setDescricao(request.descricao());
        novaCategoria.setImagemIconeUrl(request.imagemIconeUrl());

        Categoria salva = categoriaRepository.save(novaCategoria);

        // Retornamos o DTO de resposta usando o seu método estático
        return ResponseEntity.status(HttpStatus.CREATED).body(CategoriaResponse.fromEntity(salva));
    }

    /**
     * Listagem de todas as categorias para o painel administrativo.
     */
    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaResponse>> listarCategorias() {
        List<CategoriaResponse> categorias = categoriaRepository.findAll()
                .stream()
                .map(CategoriaResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(categorias);
    }

    /**
     * Rota de teste para confirmar se o Token de ADMIN está funcionando.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboardStats() {
        return ResponseEntity.ok("Bem-vinda, Admin! O acesso ao painel está liberado.");
    }
}