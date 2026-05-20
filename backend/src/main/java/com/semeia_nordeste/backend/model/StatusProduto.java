package com.semeia_nordeste.backend.model;

public enum StatusProduto {
    PENDENTE, // recém cadastrado, aguardando análise
    APROVADO, // visível na vitrine
    REJEITADO // negado pelo admin
}