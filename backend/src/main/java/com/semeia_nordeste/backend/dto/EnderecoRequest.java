package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EnderecoRequest(
        @NotBlank @Size(max = 100) String destinatario,
        @Size(max = 15) String telefone,
        @NotBlank @Size(max = 10) String cep,
        @NotBlank @Size(max = 100) String estadoCidade,
        @NotBlank @Size(max = 100) String bairro,
        @NotBlank @Size(max = 150) String rua,
        @NotBlank @Size(max = 20) String numero,
        @Size(max = 100) String complemento,
        Double latitudeDestino,
        Double longitudeDestino,
        Boolean principal) {
}
