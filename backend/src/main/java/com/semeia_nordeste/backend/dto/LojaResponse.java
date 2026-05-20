package com.semeia_nordeste.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.semeia_nordeste.backend.model.Loja;

public record LojaResponse(
        Long id,
        Long usuarioId,
        String nomeLoja,
        String descricaoBio,
        String logradouro,
        String bairro,
        String cidade,
        String estado,
        String cep,
        Boolean aceitaRetirada,
        Boolean fazEntrega,
        BigDecimal valorMinimoPedido,
        BigDecimal taxaEntregaFixa,
        String logoUrl,
        OffsetDateTime dataAbertura) {
    public static LojaResponse fromEntity(Loja l) {
        return new LojaResponse(
                l.getId(),
                l.getUsuario().getId(),
                l.getNomeLoja(),
                l.getDescricaoBio(),
                l.getLogradouro(),
                l.getBairro(),
                l.getCidade(),
                l.getEstado(),
                l.getCep(),
                l.getAceitaRetirada(),
                l.getFazEntrega(),
                l.getValorMinimoPedido(),
                l.getTaxaEntregaFixa(),
                l.getLogoUrl(),
                l.getDataAbertura());
    }
}