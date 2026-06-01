package com.semeia_nordeste.backend.dto;

import java.time.OffsetDateTime;

import com.semeia_nordeste.backend.model.Loja;

public record LojaAdminResponse(
        Long id,
        Long usuarioId,
        String usuarioNome,
        String usuarioEmail,
        String nomeLoja,
        String cidade,
        String estado,
        Boolean verificada,
        Boolean suspensa,
        String motivoSuspensao,
        OffsetDateTime dataAbertura,
        OffsetDateTime dataVerificacao) {

    public static LojaAdminResponse fromEntity(Loja l) {
        return new LojaAdminResponse(
                l.getId(),
                l.getUsuario() != null ? l.getUsuario().getId() : null,
                l.getUsuario() != null ? l.getUsuario().getNomeCompleto() : null,
                l.getUsuario() != null ? l.getUsuario().getEmail() : null,
                l.getNomeLoja(),
                l.getCidade(),
                l.getEstado(),
                l.getVerificada(),
                l.getSuspensa(),
                l.getMotivoSuspensao(),
                l.getDataAbertura(),
                l.getDataVerificacao());
    }
}
