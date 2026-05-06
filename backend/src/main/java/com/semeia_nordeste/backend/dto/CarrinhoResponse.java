package com.semeia_nordeste.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record CarrinhoResponse(
        List<CarrinhoItemResponse> itens,
        int totalItens,
        BigDecimal valorTotal) {
}