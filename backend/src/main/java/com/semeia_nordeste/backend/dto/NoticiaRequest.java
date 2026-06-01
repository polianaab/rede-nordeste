package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record NoticiaRequest(
        @NotBlank(message = "Título é obrigatório") String titulo,
        String subtitulo,
        String categoria,
        String imagemUrl,
        String descricao,
        String citacao,
        String tempoLeitura,
        Boolean publicada) {
}
