package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.StatusProduto;
import jakarta.validation.constraints.NotNull;

public record StatusProdutoRequest(
        @NotNull(message = "O status é obrigatório") StatusProduto status) {
}