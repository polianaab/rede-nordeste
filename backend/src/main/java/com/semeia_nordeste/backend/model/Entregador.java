package com.semeia_nordeste.backend.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "entregadores")
@Getter
@Setter
public class Entregador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "nome_completo", nullable = false, length = 150)
    private String nomeCompleto;

    @NotBlank
    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @NotBlank
    @Column(nullable = false, unique = true, length = 15)
    private String telefone;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String cidade;

    // Latitude/longitude da cidade base do entregador
    @Column(precision = 10)
    private Double latitudeBase;

    @Column(precision = 10)
    private Double longitudeBase;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_veiculo", nullable = false, length = 30)
    private TipoVeiculo tipoVeiculo;

    @Column(name = "placa_veiculo", length = 10)
    private String placaVeiculo;

    // CNH obrigatória para carro, caminhonete e caminhão
    @Column(name = "numero_cnh", length = 11)
    private String numeroCnh;

    @Column(name = "ativo")
    private Boolean ativo = false; // admin aprova

    @Column(name = "disponivel")
    private Boolean disponivel = true;

    @Column(name = "data_cadastro", updatable = false)
    private OffsetDateTime dataCadastro = OffsetDateTime.now();
}