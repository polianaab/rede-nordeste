package com.semeia_nordeste.backend.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.semeia_nordeste.backend.dto.ChatResponse;
import com.semeia_nordeste.backend.dto.MensagemRequest;
import com.semeia_nordeste.backend.dto.MensagemResponse;
import com.semeia_nordeste.backend.exception.UnauthorizedException;
import com.semeia_nordeste.backend.model.Chat;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.service.ChatService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/comprador/chats/abrir")
    public ResponseEntity<ChatResponse> abrirChat(
            @RequestParam Long lojaId,
            @AuthenticationPrincipal Usuario usuario) {
        Chat chat = chatService.abrirOuRetornarChat(usuario.getId(), lojaId);
        // Chat recém-aberto não tem mensagens, então preview é null e naoLidas = 0.
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ChatResponse.fromEntity(chat, 0L, null));
    }

    @GetMapping("/comprador/chats")
    public ResponseEntity<List<ChatResponse>> chatsComprador(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(chatService.listarChatsDoComprador(usuario));
    }

    @GetMapping("/produtor/chats")
    public ResponseEntity<List<ChatResponse>> chatsDaLoja(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(chatService.listarChatsDaLoja(usuario));
    }

    @GetMapping("/chats/{chatId}/mensagens")
    public ResponseEntity<Page<MensagemResponse>> mensagens(
            @PathVariable Long chatId,
            @AuthenticationPrincipal Usuario usuario,
            @PageableDefault(size = 30, sort = "dataEnvio") Pageable pageable) {
        return ResponseEntity.ok(chatService.listarMensagens(chatId, usuario, pageable));
    }

    @PostMapping("/chats/{chatId}/mensagens")
    public ResponseEntity<MensagemResponse> enviarREST(
            @PathVariable Long chatId,
            @Valid @RequestBody MensagemRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.enviarMensagem(chatId, request, usuario));
    }

    @GetMapping("/chats/nao-lidas")
    public ResponseEntity<Map<String, Long>> naoLidas(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(
                Map.of("total", chatService.totalNaoLidas(usuario)));
    }

    /**
     * WebSocket — cliente envia para /app/chat/{chatId}.
     * Servidor publica em /topic/chat/{chatId} via ChatService.enviarMensagem.
     * O Principal vem do JWT validado em WebSocketSecurityConfig.
     */
    @MessageMapping("/chat/{chatId}")
    public void enviarWebSocket(
            @DestinationVariable Long chatId,
            @Payload MensagemRequest request,
            Principal principal) {

        if (!(principal instanceof UsernamePasswordAuthenticationToken auth)
                || !(auth.getPrincipal() instanceof Usuario remetente))
            throw new UnauthorizedException("Sessão WebSocket inválida.");

        chatService.enviarMensagem(chatId, request, remetente);
    }
}
