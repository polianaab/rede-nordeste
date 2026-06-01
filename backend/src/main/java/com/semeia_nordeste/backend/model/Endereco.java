package com.semeia_nordeste.backend.model;

import java.time.OffsetDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Endereço de entrega de um usuário (comprador ou produtor).
 *
 * Why armazenar no backend (e não localStorage): dados como CEP + número da
 * casa + telefone do destinatário são pessoais. localStorage é vulnerável a
 * qualquer XSS executado no domínio — uma extensão maliciosa, um script
 * comprometido em CDN, etc. — então mantemos no banco, sob @PreAuthorize +
 * isolamento por usuario_id.
 */
@Entity
@Table(name = "enderecos")
@Getter
@Setter
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String destinatario;

    @Size(max = 15)
    @Column(length = 15)
    private String telefone;

    @NotBlank
    @Size(max = 10)
    @Column(nullable = false, length = 10)
    private String cep;

    @NotBlank
    @Size(max = 100)
    @Column(name = "estado_cidade", nullable = false, length = 100)
    private String estadoCidade;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String bairro;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String rua;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String numero;

    @Size(max = 100)
    @Column(length = 100)
    private String complemento;

    @Column(name = "latitude_destino")
    private Double latitudeDestino;

    @Column(name = "longitude_destino")
    private Double longitudeDestino;

    @Column(nullable = false)
    private Boolean principal = false;

    @Column(name = "data_criacao", updatable = false)
    private OffsetDateTime dataCriacao = OffsetDateTime.now();
}
