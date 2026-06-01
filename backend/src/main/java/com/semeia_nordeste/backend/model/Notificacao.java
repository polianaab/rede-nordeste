package com.semeia_nordeste.backend.model;

import java.time.OffsetDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Notificação para um usuário específico.
 *
 * Isolamento: SEMPRE filtrar por usuario_id em queries (NotificacaoService).
 * Notificações globais devem ser criadas como N entradas (uma por usuário)
 * ou via tabela separada — nunca expor cross-user.
 */
@Entity
@Table(name = "notificacoes",
        indexes = @Index(name = "idx_notificacoes_usuario", columnList = "usuario_id, lida"))
@Getter
@Setter
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoNotificacao tipo = TipoNotificacao.SISTEMA;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String titulo;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "link_acao", length = 255)
    private String linkAcao;

    @Column(nullable = false)
    private Boolean lida = false;

    @Column(name = "data_criacao", updatable = false)
    private OffsetDateTime dataCriacao = OffsetDateTime.now();

    @Column(name = "data_leitura")
    private OffsetDateTime dataLeitura;
}
