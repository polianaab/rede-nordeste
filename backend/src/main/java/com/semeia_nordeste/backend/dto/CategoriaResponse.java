package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Categoria;

public record CategoriaResponse(
        Long id,
        String nome,
        String descricao,
        String imagemIconeUrl) {
    public static CategoriaResponse fromEntity(Categoria c) {
        return new CategoriaResponse(
                c.getId(),
                c.getNome(),
                c.getDescricao(),
                c.getImagemIconeUrl());
    }
}