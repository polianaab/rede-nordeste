package com.semeia_nordeste.backend.service;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.ProdutoRequest;
import com.semeia_nordeste.backend.model.Categoria;
import com.semeia_nordeste.backend.model.Loja;
import com.semeia_nordeste.backend.model.Produto;
import com.semeia_nordeste.backend.repository.CategoriaRepository;
import com.semeia_nordeste.backend.repository.LojaRepository;
import com.semeia_nordeste.backend.repository.ProdutoRepository;
import com.semeia_nordeste.backend.security.UsuarioAutenticado;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final LojaRepository lojaRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioAutenticado usuarioAutenticado;

    public ProdutoService(ProdutoRepository produtoRepository,
            LojaRepository lojaRepository,
            CategoriaRepository categoriaRepository,
            UsuarioAutenticado usuarioAutenticado) {
        this.produtoRepository = produtoRepository;
        this.lojaRepository = lojaRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioAutenticado = usuarioAutenticado;
    }

    @Transactional
    public Produto criar(ProdutoRequest request) {
        var logado = usuarioAutenticado.get();

        Loja loja = lojaRepository.findByUsuarioId(logado.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Você precisa cadastrar uma loja antes de adicionar produtos."));

        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        return salvarDados(new Produto(), request, loja, categoria);
    }

    @Transactional
    public Produto atualizar(Long produtoId, ProdutoRequest request) {
        var logado = usuarioAutenticado.get();

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        boolean isAdmin = usuarioAutenticado.isAdmin();
        boolean isDono = produto.getLoja().getUsuario().getId().equals(logado.getId());

        if (!isAdmin && !isDono)
            throw new SecurityException("Você não tem permissão para editar este produto.");

        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        return salvarDados(produto, request, produto.getLoja(), categoria);
    }

    @Transactional
    public void deletar(Long produtoId) {
        var logado = usuarioAutenticado.get();

        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        boolean isAdmin = usuarioAutenticado.isAdmin();
        boolean isDono = produto.getLoja().getUsuario().getId().equals(logado.getId());

        if (!isAdmin && !isDono)
            throw new SecurityException("Você não tem permissão para deletar este produto.");

        produtoRepository.delete(produto);
    }

    public Page<Produto> listarPorLoja(Long lojaId, Pageable pageable) {
        return produtoRepository.findByLojaId(lojaId, pageable);
    }

    public Page<Produto> buscar(String nome, Long categoriaId, Pageable pageable) {
        if (categoriaId != null)
            return produtoRepository.findByCategoriaId(categoriaId, pageable);
        if (nome != null && !nome.isBlank())
            return produtoRepository.findByNomeContainingIgnoreCase(nome, pageable);
        return produtoRepository.findAll(pageable);
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
    }

    private Produto salvarDados(Produto p, ProdutoRequest r, Loja loja, Categoria cat) {
        p.setLoja(loja);
        p.setCategoria(cat);
        p.setNome(r.nome());
        p.setDescricao(r.descricao());
        p.setPrecoAtual(r.precoAtual());
        p.setUnidadeMedida(r.unidadeMedida());
        p.setEstoqueAtual(r.estoqueAtual() != null ? r.estoqueAtual() : 0);
        p.setPesoKg(r.pesoKg() != null ? r.pesoKg() : BigDecimal.valueOf(0.5));
        p.setImagemUrl(r.imagemUrl());
        return produtoRepository.save(p);
    }
}