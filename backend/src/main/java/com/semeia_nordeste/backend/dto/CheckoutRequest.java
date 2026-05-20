package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank String metodoPagamento,
        boolean retiradaNaLoja,
        String enderecoEntrega,
        String cidadeDestino,
        Double latitudeDestino,
        Double longitudeDestino,
        String observacoes) {
}