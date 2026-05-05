package com.semeia_nordeste.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.semeia_nordeste.backend.dto.ProdutoRequest;
import com.semeia_nordeste.backend.dto.ProdutoResponse;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.service.ProdutoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // Produtor cadastra produto
    @PostMapping("/produtor/produtos")
    public ResponseEntity<ProdutoResponse> criar(
            @Valid @RequestBody ProdutoRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ProdutoResponse.fromEntity(produtoService.criar(request, usuario)));
    }

    // Produtor edita produto
    @PutMapping("/produtor/produtos/{id}")
    public ResponseEntity<ProdutoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(ProdutoResponse.fromEntity(produtoService.atualizar(id, request, usuario)));
    }

    // Produtor deleta produto
    @DeleteMapping("/produtor/produtos/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        produtoService.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }

    // Público — lista produtos de uma loja (paginado)
    @GetMapping("/lojas/{lojaId}/produtos")
    public ResponseEntity<Page<ProdutoResponse>> listarPorLoja(
            @PathVariable Long lojaId,
            @PageableDefault(size = 20, sort = "dataCadastro") Pageable pageable) {
        return ResponseEntity.ok(
                produtoService.listarPorLoja(lojaId, pageable).map(ProdutoResponse::fromEntity));
    }

    // Público — marketplace: busca por nome ou categoria
    @GetMapping("/produtos")
    public ResponseEntity<Page<ProdutoResponse>> buscar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long categoriaId,
            @PageableDefault(size = 20, sort = "dataCadastro") Pageable pageable) {
        return ResponseEntity.ok(
                produtoService.buscar(nome, categoriaId, pageable).map(ProdutoResponse::fromEntity));
    }

    // Público — detalhe de um produto
    @GetMapping("/produtos/{id}")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ProdutoResponse.fromEntity(produtoService.buscarPorId(id)));
    }
}