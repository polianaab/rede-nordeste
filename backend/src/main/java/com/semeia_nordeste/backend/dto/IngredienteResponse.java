package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Produto;
import java.math.BigDecimal;

// Versão resumida do produto para exibir dentro da receita
public record IngredienteResponse(
        Long id,
        String nome,
        String unidadeMedida,
        BigDecimal precoAtual,
        String imagemUrl,
        String nomeLoja) {
    public static IngredienteResponse fromProduto(Produto p) {
        return new IngredienteResponse(
                p.getId(),
                p.getNome(),
                p.getUnidadeMedida(),
                p.getPrecoAtual(),
                p.getImagemUrl(),
                p.getLoja() != null ? p.getLoja().getNomeLoja() : null);
    }
}