package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * PATCH /api/usuarios/me — campos editáveis pelo próprio usuário logado.
 *
 * Todos os campos são opcionais (null = não muda). Campos NÃO permitidos
 * intencionalmente: tipoPerfil (apenas admin), contaAtiva (apenas admin),
 * cpfCnpj (não permitimos edição depois do cadastro — anti-fraude).
 *
 * novaSenha só atualiza se senhaAtual for fornecida e bater.
 */
public record AtualizarMeRequest(
        @Size(max = 150) String nomeCompleto,
        @Email @Size(max = 100) String email,
        @Size(max = 15) String telefone,
        String fotoPerfilUrl,
        String senhaAtual,
        @Size(min = 6, max = 100, message = "Nova senha deve ter no mínimo 6 caracteres") String novaSenha) {
}
