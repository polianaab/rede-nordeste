package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Banner;

public record BannerResponse(
        Long id,
        String tipo,
        String titulo,
        String subtitulo,
        String imagemUrl,
        String corDestaque,
        Long linkBlogId,
        Integer ordem,
        Boolean ativo) {

    public static BannerResponse fromEntity(Banner b) {
        return new BannerResponse(
                b.getId(), b.getTipo(), b.getTitulo(), b.getSubtitulo(),
                b.getImagemUrl(), b.getCorDestaque(), b.getLinkBlogId(),
                b.getOrdem(), b.getAtivo());
    }
}
