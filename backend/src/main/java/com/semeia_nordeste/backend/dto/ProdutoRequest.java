package com.semeia_nordeste.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProdutoRequest(

        @NotNull(message = "A categoria é obrigatória") Long categoriaId,

        @NotBlank(message = "O nome do produto é obrigatório") @Size(max = 100) String nome,

        String descricao,

        @NotNull @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero") BigDecimal precoAtual,

        @NotBlank(message = "A unidade de medida é obrigatória") @Size(max = 20) String unidadeMedida,

        @Min(0) Integer estoqueAtual,

        String imagemUrl) {
}