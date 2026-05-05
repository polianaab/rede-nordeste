package com.semeia_nordeste.backend.dto;

import java.time.OffsetDateTime;

import com.semeia_nordeste.backend.model.TipoPerfil;
import com.semeia_nordeste.backend.model.Usuario;

public record UsuarioResponse(
        Long id,
        String nomeCompleto,
        String email,
        String telefone,
        TipoPerfil tipoPerfil,
        String fotoPerfilUrl,
        Boolean contaAtiva,
        OffsetDateTime dataCriacao) {
    public static UsuarioResponse fromEntity(Usuario u) {
        return new UsuarioResponse(
                u.getId(),
                u.getNomeCompleto(),
                u.getEmail(),
                u.getTelefone(),
                u.getTipoPerfil(),
                u.getFotoPerfilUrl(),
                u.getContaAtiva(),
                u.getDataCriacao());
    }
}