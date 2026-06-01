package com.semeia_nordeste.backend.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "noticias")
@Getter
@Setter
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200, nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String subtitulo;

    @Column(length = 40)
    private String categoria = "NOTICIA";

    @Column(name = "imagem_url", columnDefinition = "TEXT")
    private String imagemUrl;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(columnDefinition = "TEXT")
    private String citacao;

    @Column(name = "tempo_leitura", length = 20)
    private String tempoLeitura = "3 min";

    @Column(nullable = false)
    private Boolean publicada = true;

    @Column(name = "data_criacao", updatable = false)
    private OffsetDateTime dataCriacao = OffsetDateTime.now();

    @Column(name = "data_atualizacao")
    private OffsetDateTime dataAtualizacao = OffsetDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.dataAtualizacao = OffsetDateTime.now();
    }
}
