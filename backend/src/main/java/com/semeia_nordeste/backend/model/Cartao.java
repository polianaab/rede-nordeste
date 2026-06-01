package com.semeia_nordeste.backend.model;

import java.time.OffsetDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Cartão de pagamento salvo do usuário.
 *
 * IMPORTANTE — PCI compliance: NÃO guardamos o PAN completo, CVV ou validade
 * sensível. Apenas:
 *   • últimos 4 dígitos (final) — para exibir "**** 4452" na UI
 *   • bandeira detectada — derivada do PAN antes de descartar
 *   • titular — texto livre
 *   • validade (MM/AA) — necessário para retornar ao gateway, mas considere
 *     tokenizar via PSP em produção.
 *
 * Em produção real esta tabela deve ser substituída por TOKENS do PSP
 * (Stripe/Pagar.me/etc) — nunca armazene PAN diretamente.
 */
@Entity
@Table(name = "cartoes")
@Getter
@Setter
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String titular;

    @NotBlank
    @Pattern(regexp = "\\d{4}", message = "Final deve ter 4 dígitos")
    @Column(nullable = false, length = 4)
    private String finalCartao;

    @Size(max = 30)
    @Column(length = 30)
    private String bandeira;

    @NotBlank
    @Pattern(regexp = "\\d{2}/\\d{2}", message = "Validade deve estar no formato MM/AA")
    @Column(nullable = false, length = 5)
    private String validade;

    @Column(name = "data_criacao", updatable = false)
    private OffsetDateTime dataCriacao = OffsetDateTime.now();
}
