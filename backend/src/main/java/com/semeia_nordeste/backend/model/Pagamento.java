package com.semeia_nordeste.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Entity
@Table(name = "pagamentos")
@Getter
@Setter
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metodo_pagamento", nullable = false, length = 50)
    private String metodoPagamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pagamento", length = 30)
    private StatusPagamento statusPagamento = StatusPagamento.AGUARDANDO;

    @Column(name = "data_pagamento")
    private OffsetDateTime dataPagamento;
}