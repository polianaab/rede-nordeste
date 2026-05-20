package com.semeia_nordeste.backend.dto;

import java.time.OffsetDateTime;

public record WebSocketMensagemDTO(
        Long chatId,
        Long remetenteId,
        String nomeRemetente,
        String conteudo,
        OffsetDateTime dataEnvio) {
}