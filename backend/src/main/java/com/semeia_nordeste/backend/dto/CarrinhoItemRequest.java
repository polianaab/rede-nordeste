package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CarrinhoItemRequest(
        @NotNull(message = "O produto é obrigatório") Long produtoId,

        @Min(value = 1, message = "A quantidade deve ser pelo menos 1") int quantidade) {
}