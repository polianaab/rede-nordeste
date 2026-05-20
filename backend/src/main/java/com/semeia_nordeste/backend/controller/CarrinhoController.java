package com.semeia_nordeste.backend.controller;

import com.semeia_nordeste.backend.dto.*;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.service.CarrinhoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comprador/carrinho")
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    public CarrinhoController(CarrinhoService carrinhoService) {
        this.carrinhoService = carrinhoService;
    }

    @GetMapping
    public ResponseEntity<CarrinhoResponse> listar(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(carrinhoService.listar(usuario));
    }

    @PostMapping
    public ResponseEntity<CarrinhoResponse> adicionar(
            @Valid @RequestBody CarrinhoItemRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(carrinhoService.adicionar(request, usuario));
    }

    @DeleteMapping("/{produtoId}")
    public ResponseEntity<CarrinhoResponse> remover(
            @PathVariable Long produtoId,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(carrinhoService.remover(produtoId, usuario));
    }

    @DeleteMapping
    public ResponseEntity<Void> limpar(@AuthenticationPrincipal Usuario usuario) {
        carrinhoService.limpar(usuario);
        return ResponseEntity.noContent().build();
    }
}