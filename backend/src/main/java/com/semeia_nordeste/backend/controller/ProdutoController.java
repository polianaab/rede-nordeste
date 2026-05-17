package com.semeia_nordeste.backend.controller;

import com.semeia_nordeste.backend.dto.ProdutoRequest;
import com.semeia_nordeste.backend.dto.ProdutoResponse;
import com.semeia_nordeste.backend.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProdutoController {

        private final ProdutoService produtoService;

        public ProdutoController(ProdutoService produtoService) {
                this.produtoService = produtoService;
        }

        @PostMapping("/produtor/produtos")
        public ResponseEntity<ProdutoResponse> criar(
                        @Valid @RequestBody ProdutoRequest request) {
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ProdutoResponse.fromEntity(produtoService.criar(request)));
        }

        @PutMapping("/produtor/produtos/{id}")
        public ResponseEntity<ProdutoResponse> atualizar(
                        @PathVariable Long id,
                        @Valid @RequestBody ProdutoRequest request) {
                return ResponseEntity.ok(
                                ProdutoResponse.fromEntity(produtoService.atualizar(id, request)));
        }

        @DeleteMapping("/produtor/produtos/{id}")
        public ResponseEntity<Void> deletar(@PathVariable Long id) {
                produtoService.deletar(id);
                return ResponseEntity.noContent().build();
        }

        @GetMapping("/lojas/{lojaId}/produtos")
        public ResponseEntity<Page<ProdutoResponse>> listarPorLoja(
                        @PathVariable Long lojaId,
                        @PageableDefault(size = 20, sort = "dataCadastro") Pageable pageable) {
                return ResponseEntity.ok(
                                produtoService.listarPorLoja(lojaId, pageable)
                                                .map(ProdutoResponse::fromEntity));
        }

        @GetMapping("/produtos")
        public ResponseEntity<Page<ProdutoResponse>> buscar(
                        @RequestParam(required = false) String nome,
                        @RequestParam(required = false) Long categoriaId,
                        @PageableDefault(size = 20, sort = "dataCadastro") Pageable pageable) {
                return ResponseEntity.ok(
                                produtoService.buscar(nome, categoriaId, pageable)
                                                .map(ProdutoResponse::fromEntity));
        }

        @GetMapping("/produtos/{id}")
        public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
                return ResponseEntity.ok(
                                ProdutoResponse.fromEntity(produtoService.buscarPorId(id)));
        }
}