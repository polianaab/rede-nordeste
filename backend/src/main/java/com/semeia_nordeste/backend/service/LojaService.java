package com.semeia_nordeste.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.LojaRequest;
import com.semeia_nordeste.backend.model.Loja;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.LojaRepository;

@Service
public class LojaService {

    private final LojaRepository lojaRepository;

    public LojaService(LojaRepository lojaRepository) {
        this.lojaRepository = lojaRepository;
    }

    @Transactional
    public Loja criar(LojaRequest request, Usuario usuario) {
        if (lojaRepository.existsByUsuarioId(usuario.getId()))
            throw new RuntimeException("Você já possui uma loja cadastrada.");

        if (lojaRepository.existsByNomeLoja(request.nomeLoja()))
            throw new RuntimeException("Já existe uma loja com esse nome.");

        Loja loja = new Loja();
        return salvarDados(loja, request, usuario);
    }

    @Transactional
    public Loja atualizar(LojaRequest request, Usuario usuario) {
        Loja loja = lojaRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada."));
        return salvarDados(loja, request, usuario);
    }

    public Loja buscarPorUsuario(Usuario usuario) {
        return lojaRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Loja não encontrada."));
    }

    public Loja buscarPorId(Long id) {
        return lojaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loja não encontrada."));
    }

    private Loja salvarDados(Loja loja, LojaRequest request, Usuario usuario) {
        loja.setUsuario(usuario);
        loja.setNomeLoja(request.nomeLoja());
        loja.setDescricaoBio(request.descricaoBio());
        loja.setLogradouro(request.logradouro());
        loja.setBairro(request.bairro());
        loja.setCidade(request.cidade());
        loja.setEstado(request.estado() != null ? request.estado() : "SE");
        loja.setCep(request.cep());
        loja.setAceitaRetirada(request.aceitaRetirada() != null ? request.aceitaRetirada() : true);
        loja.setFazEntrega(request.fazEntrega() != null ? request.fazEntrega() : false);
        loja.setValorMinimoPedido(request.valorMinimoPedido());
        loja.setTaxaEntregaFixa(request.taxaEntregaFixa());
        loja.setLogoUrl(request.logoUrl());
        return lojaRepository.save(loja);
    }
}