package com.semeia_nordeste.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Entity
@Table(name = "mensagens")
@Getter
@Setter
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "remetente_id", nullable = false)
    private Usuario remetente;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "data_envio", updatable = false)
    private OffsetDateTime dataEnvio = OffsetDateTime.now();

    @Column(nullable = false)
    private Boolean lida = false;
}