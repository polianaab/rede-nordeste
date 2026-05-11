package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Mensagem;
import java.time.OffsetDateTime;

public record MensagemResponse(
        Long id,
        Long chatId,
        Long remetenteId,
        String nomeRemetente,
        String conteudo,
        Boolean lida,
        OffsetDateTime dataEnvio) {
    public static MensagemResponse fromEntity(Mensagem m) {
        return new MensagemResponse(
                m.getId(),
                m.getChat().getId(),
                m.getRemetente().getId(),
                m.getRemetente().getNomeCompleto(),
                m.getConteudo(),
                m.getLida(),
                m.getDataEnvio());
    }
}