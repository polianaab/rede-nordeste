package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "O nome da categoria é obrigatório") @Size(max = 50) String nome,

        String descricao,
        String imagemIconeUrl) {
}