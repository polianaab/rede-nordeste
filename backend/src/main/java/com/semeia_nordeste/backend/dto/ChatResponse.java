package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Chat;
import com.semeia_nordeste.backend.model.Mensagem;
import java.time.OffsetDateTime;

public record ChatResponse(
        Long id,
        Long compradorId,
        String nomeComprador,
        Long lojaId,
        String nomeLoja,
        String logoLoja,
        OffsetDateTime dataInicio,
        long naoLidas,
        String ultimaMensagem,
        OffsetDateTime dataUltimaMensagem,
        Long remetenteUltimaMensagem
) {
    public static ChatResponse fromEntity(Chat c, long naoLidas, Mensagem ultima) {
        return new ChatResponse(
                c.getId(),
                c.getComprador().getId(),
                c.getComprador().getNomeCompleto(),
                c.getLoja().getId(),
                c.getLoja().getNomeLoja(),
                c.getLoja().getLogoUrl(),
                c.getDataInicio(),
                naoLidas,
                ultima != null ? ultima.getConteudo() : null,
                ultima != null ? ultima.getDataEnvio() : null,
                ultima != null ? ultima.getRemetente().getId() : null);
    }
}
