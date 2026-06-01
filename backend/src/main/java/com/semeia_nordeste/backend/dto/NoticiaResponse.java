package com.semeia_nordeste.backend.dto;

import java.time.OffsetDateTime;

import com.semeia_nordeste.backend.model.Noticia;

public record NoticiaResponse(
        Long id,
        String titulo,
        String subtitulo,
        String categoria,
        String imagemUrl,
        String descricao,
        String citacao,
        String tempoLeitura,
        Boolean publicada,
        OffsetDateTime dataCriacao) {

    public static NoticiaResponse fromEntity(Noticia n) {
        return new NoticiaResponse(
                n.getId(), n.getTitulo(), n.getSubtitulo(), n.getCategoria(),
                n.getImagemUrl(), n.getDescricao(), n.getCitacao(),
                n.getTempoLeitura(), n.getPublicada(), n.getDataCriacao());
    }
}
