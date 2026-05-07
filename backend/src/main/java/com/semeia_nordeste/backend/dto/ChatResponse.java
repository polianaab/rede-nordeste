package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Chat;
import java.time.OffsetDateTime;

public record ChatResponse(
        Long id,
        Long compradorId,
        String nomeComprador,
        Long lojaId,
        String nomeLoja,
        String logoLoja,
        OffsetDateTime dataInicio,
        long naoLidas // badge de notificação
) {
    public static ChatResponse fromEntity(Chat c, long naoLidas) {
        return new ChatResponse(
                c.getId(),
                c.getComprador().getId(),
                c.getComprador().getNomeCompleto(),
                c.getLoja().getId(),
                c.getLoja().getNomeLoja(),
                c.getLoja().getLogoUrl(),
                c.getDataInicio(),
                naoLidas);
    }
}