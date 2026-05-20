package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.ItemPedido;
import java.math.BigDecimal;

public record ItemPedidoResponse(
        Long produtoId,
        String nomeProduto,
        Integer quantidade,
        BigDecimal precoUnitarioNoMomento,
        BigDecimal subtotal) {
    public static ItemPedidoResponse fromEntity(ItemPedido i) {
        return new ItemPedidoResponse(
                i.getProduto().getId(),
                i.getProduto().getNome(),
                i.getQuantidade(),
                i.getPrecoUnitarioNoMomento(),
                i.getPrecoUnitarioNoMomento().multiply(BigDecimal.valueOf(i.getQuantidade())));
    }
}