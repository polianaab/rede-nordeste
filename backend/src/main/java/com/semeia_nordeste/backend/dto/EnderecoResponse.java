package com.semeia_nordeste.backend.dto;

import com.semeia_nordeste.backend.model.Endereco;

public record EnderecoResponse(
        Long id,
        String destinatario,
        String telefone,
        String cep,
        String estadoCidade,
        String bairro,
        String rua,
        String numero,
        String complemento,
        Double latitudeDestino,
        Double longitudeDestino,
        Boolean principal) {

    public static EnderecoResponse fromEntity(Endereco e) {
        return new EnderecoResponse(
                e.getId(),
                e.getDestinatario(),
                e.getTelefone(),
                e.getCep(),
                e.getEstadoCidade(),
                e.getBairro(),
                e.getRua(),
                e.getNumero(),
                e.getComplemento(),
                e.getLatitudeDestino(),
                e.getLongitudeDestino(),
                e.getPrincipal());
    }
}
