package com.semeia_nordeste.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "categorias")
@Getter
@Setter
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da categoria é obrigatório")
    @Size(max = 50)
    @Column(nullable = false, unique = true, length = 50)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "imagem_icone_url", columnDefinition = "TEXT")
    private String imagemIconeUrl;
}