package com.semeia_nordeste.backend.dto;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReceitaRequest(

        @NotBlank(message = "O título é obrigatório") @Size(max = 150) String titulo,

        String descricao,

        @NotBlank(message = "O modo de preparo é obrigatório") String modoPreparo,

        @NotNull(message = "O tempo de preparo é obrigatório") @Min(value = 1, message = "Tempo de preparo deve ser maior que zero") Integer tempoPreparoMin,

        String imagemUrl,

        // IDs dos produtos da plataforma usados como ingredientes
        // Pode ser vazio — receita sem produtos vinculados é válida
        List<Long> ingredienteIds) {
}