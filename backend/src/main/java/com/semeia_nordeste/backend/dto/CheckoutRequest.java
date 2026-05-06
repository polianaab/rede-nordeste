package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank(message = "O método de pagamento é obrigatório") String metodoPagamento,

        boolean retiradaNaLoja,

        String enderecoEntrega,

        String observacoes) {
}