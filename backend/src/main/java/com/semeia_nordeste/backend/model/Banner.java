package com.semeia_nordeste.backend.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "banners_home")
@Getter
@Setter
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String tipo = "DESTAQUE";

    @Column(length = 150, nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String subtitulo;

    @Column(name = "imagem_url", columnDefinition = "TEXT", nullable = false)
    private String imagemUrl;

    @Column(name = "cor_destaque", length = 40)
    private String corDestaque = "text-[#f9943b]";

    @Column(name = "link_blog_id")
    private Long linkBlogId;

    @Column(nullable = false)
    private Integer ordem = 0;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "data_criacao", updatable = false)
    private OffsetDateTime dataCriacao = OffsetDateTime.now();
}
