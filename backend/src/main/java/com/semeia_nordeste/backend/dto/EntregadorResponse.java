package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Entregador;
import com.semeia_nordeste.backend.model.TipoVeiculo;

public record EntregadorResponse(
        Long id,
        String nomeCompleto,
        String telefone,
        String cidade,
        TipoVeiculo tipoVeiculo,
        Boolean ativo,
        Boolean disponivel) {
    public static EntregadorResponse fromEntity(Entregador e) {
        return new EntregadorResponse(
                e.getId(),
                e.getNomeCompleto(),
                e.getTelefone(),
                e.getCidade(),
                e.getTipoVeiculo(),
                e.getAtivo(),
                e.getDisponivel());
    }
}