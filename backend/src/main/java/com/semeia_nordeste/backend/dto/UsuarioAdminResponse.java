package com.semeia_nordeste.backend.dto;

import java.time.OffsetDateTime;

import com.semeia_nordeste.backend.model.TipoPerfil;
import com.semeia_nordeste.backend.model.Usuario;

public record UsuarioAdminResponse(
        Long id,
        String nomeCompleto,
        String email,
        String telefone,
        String cpfCnpj,
        TipoPerfil tipoPerfil,
        Boolean contaAtiva,
        String motivoSuspensao,
        OffsetDateTime dataCriacao,
        OffsetDateTime dataUltimoLogin) {

    public static UsuarioAdminResponse fromEntity(Usuario u) {
        return new UsuarioAdminResponse(
                u.getId(), u.getNomeCompleto(), u.getEmail(), u.getTelefone(),
                u.getCpfCnpj(), u.getTipoPerfil(), u.getContaAtiva(),
                u.getMotivoSuspensao(), u.getDataCriacao(), u.getDataUltimoLogin());
    }
}
