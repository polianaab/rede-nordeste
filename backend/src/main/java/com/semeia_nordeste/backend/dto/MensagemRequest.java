package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MensagemRequest(
        @NotBlank(message = "A mensagem não pode estar vazia") @Size(max = 2000, message = "Mensagem muito longa") String conteudo) {
}