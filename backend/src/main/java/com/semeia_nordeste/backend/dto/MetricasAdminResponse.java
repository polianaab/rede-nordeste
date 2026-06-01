package com.semeia_nordeste.backend.dto;

import java.math.BigDecimal;

public record MetricasAdminResponse(
        long totalUsuarios,
        long totalCompradores,
        long totalProdutores,
        long totalLojasVerificadas,
        long totalLojasPendentes,
        long totalProdutosAprovados,
        long totalProdutosPendentes,
        long totalPedidos,
        BigDecimal valorTotalVendas,
        long totalCategorias) {
}
