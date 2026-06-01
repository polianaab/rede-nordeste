package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record BannerRequest(
        String tipo,
        @NotBlank(message = "Título é obrigatório") String titulo,
        String subtitulo,
        @NotBlank(message = "Imagem é obrigatória") String imagemUrl,
        String corDestaque,
        Long linkBlogId,
        Integer ordem,
        Boolean ativo) {
}
