package com.semeia_nordeste.backend.dto;

public record NotificacaoDTO(
        Long chatId,
        String remetente,
        String previewMensagem) {
}