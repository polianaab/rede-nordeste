package com.semeia_nordeste.backend.model;

import java.time.OffsetDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "receitas")
@Getter
@Setter
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "modo_preparo", nullable = false, columnDefinition = "TEXT")
    private String modoPreparo;

    @Column(name = "tempo_preparo_min", nullable = false)
    private Integer tempoPreparoMin;

    @Column(name = "imagem_url", columnDefinition = "TEXT")
    private String imagemUrl;

    // Produtos da plataforma usados como ingredientes
    @ManyToMany
    @JoinTable(name = "receita_ingredientes", joinColumns = @JoinColumn(name = "receita_id"), inverseJoinColumns = @JoinColumn(name = "produto_id"))
    private List<Produto> ingredientes;

    @Column(name = "data_criacao", updatable = false)
    private OffsetDateTime dataCriacao = OffsetDateTime.now();
}