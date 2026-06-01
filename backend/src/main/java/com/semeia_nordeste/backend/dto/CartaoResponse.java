package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Cartao;

public record CartaoResponse(
        Long id,
        String titular,
        String finalCartao,
        String bandeira,
        String validade) {

    public static CartaoResponse fromEntity(Cartao c) {
        return new CartaoResponse(
                c.getId(),
                c.getTitular(),
                c.getFinalCartao(),
                c.getBandeira(),
                c.getValidade());
    }
}
