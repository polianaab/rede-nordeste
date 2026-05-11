package com.semeia_nordeste.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "chats", uniqueConstraints = @UniqueConstraint(columnNames = { "comprador_id", "loja_id" }))
@Getter
@Setter
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comprador_id", nullable = false)
    private Usuario comprador;

    @ManyToOne
    @JoinColumn(name = "loja_id", nullable = false)
    private Loja loja;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("dataEnvio ASC")
    private List<Mensagem> mensagens;

    @Column(name = "data_inicio", updatable = false)
    private OffsetDateTime dataInicio = OffsetDateTime.now();
}