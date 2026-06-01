package com.semeia_nordeste.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.semeia_nordeste.backend.dto.NotificacaoResponse;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.service.NotificacaoService;

@RestController
@RequestMapping("/api/usuarios/notificacoes")
public class NotificacaoController {

    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> listar(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(service.listar(usuario).stream().map(NotificacaoResponse::fromEntity).toList());
    }

    @GetMapping("/contagem-nao-lidas")
    public ResponseEntity<Map<String, Long>> contarNaoLidas(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(Map.of("naoLidas", service.contarNaoLidas(usuario)));
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<NotificacaoResponse> marcarComoLida(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(NotificacaoResponse.fromEntity(service.marcarComoLida(id, usuario)));
    }

    @PatchMapping("/todas-lidas")
    public ResponseEntity<Void> marcarTodasComoLidas(@AuthenticationPrincipal Usuario usuario) {
        service.marcarTodasComoLidas(usuario);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        service.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> limparTodas(@AuthenticationPrincipal Usuario usuario) {
        service.limparTodas(usuario);
        return ResponseEntity.noContent().build();
    }
}
