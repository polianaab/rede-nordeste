package com.semeia_nordeste.backend.dto;

import java.time.OffsetDateTime;

import com.semeia_nordeste.backend.model.Notificacao;
import com.semeia_nordeste.backend.model.TipoNotificacao;

public record NotificacaoResponse(
        Long id,
        TipoNotificacao tipo,
        String titulo,
        String mensagem,
        String linkAcao,
        Boolean lida,
        OffsetDateTime dataCriacao,
        OffsetDateTime dataLeitura) {

    public static NotificacaoResponse fromEntity(Notificacao n) {
        return new NotificacaoResponse(
                n.getId(),
                n.getTipo(),
                n.getTitulo(),
                n.getMensagem(),
                n.getLinkAcao(),
                n.getLida(),
                n.getDataCriacao(),
                n.getDataLeitura());
    }
}
