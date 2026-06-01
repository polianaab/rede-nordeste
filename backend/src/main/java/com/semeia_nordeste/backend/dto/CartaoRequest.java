package com.semeia_nordeste.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Body para adicionar cartão.
 *
 * O número COMPLETO chega aqui mas é processado somente em memória — extraímos
 * os últimos 4 e a bandeira, e nunca persistimos o PAN inteiro. Veja o
 * comentário do model Cartao para a justificativa PCI.
 */
public record CartaoRequest(
        @NotBlank @Size(max = 100) String titular,
        @NotBlank @Pattern(regexp = "\\d{13,19}", message = "Número do cartão inválido") String numero,
        @NotBlank @Pattern(regexp = "\\d{2}/\\d{2}", message = "Validade no formato MM/AA") String validade,
        @NotBlank @Pattern(regexp = "\\d{3,4}", message = "CVV inválido") String cvv) {
}
