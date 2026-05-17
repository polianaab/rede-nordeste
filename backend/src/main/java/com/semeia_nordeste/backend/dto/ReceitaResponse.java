package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Receita;
import java.time.OffsetDateTime;
import java.util.List;

public record ReceitaResponse(
        Long id,
        Long autorId,
        String nomeAutor,
        String titulo,
        String descricao,
        String modoPreparo,
        Integer tempoPreparoMin,
        String imagemUrl,
        List<IngredienteResponse> ingredientes,
        OffsetDateTime dataCriacao) {
    public static ReceitaResponse fromEntity(Receita r) {
        return new ReceitaResponse(
                r.getId(),
                r.getAutor().getId(),
                r.getAutor().getNomeCompleto(),
                r.getTitulo(),
                r.getDescricao(),
                r.getModoPreparo(),
                r.getTempoPreparoMin(),
                r.getImagemUrl(),
                r.getIngredientes() != null
                        ? r.getIngredientes().stream()
                                .map(IngredienteResponse::fromProduto)
                                .toList()
                        : List.of(),
                r.getDataCriacao());
    }
}