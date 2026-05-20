package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.TipoVeiculo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EntregadorRequest(
        @NotBlank String nomeCompleto,
        @NotBlank String cpf,
        @NotBlank String telefone,
        @NotBlank String cidade,
        Double latitudeBase,
        Double longitudeBase,
        @NotNull TipoVeiculo tipoVeiculo,
        String placaVeiculo,
        String numeroCnh) {
}