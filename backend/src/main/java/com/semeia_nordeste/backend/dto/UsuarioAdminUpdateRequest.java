package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.TipoPerfil;

public record UsuarioAdminUpdateRequest(
        Boolean contaAtiva,
        TipoPerfil tipoPerfil,
        String motivoSuspensao,
        String novaSenha) {
}
