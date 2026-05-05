package com.semeia_nordeste.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.ProdutoRequest;
import com.semeia_nordeste.backend.model.Categoria;
import com.semeia_nordeste.backend.model.Loja;
import com.semeia_nordeste.backend.model.Produto;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.CategoriaRepository;
import com.semeia_nordeste.backend.repository.LojaRepository;
import com.semeia_nordeste.backend.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final LojaRepository lojaRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository,
            LojaRepository lojaRepository,
            CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.lojaRepository = lojaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public Produto criar(ProdutoRequest request, Usuario usuario) {
        Loja loja = lojaRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Você precisa ter uma loja para cadastrar produtos."));

        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        Produto produto = new Produto();
        return salvarDados(produto, request, loja, categoria);
    }

    @Transactional
    public Produto atualizar(Long produtoId, ProdutoRequest request, Usuario usuario) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        // Garante que o produto pertence à loja do usuário logado
        if (!produto.getLoja().getUsuario().getId().equals(usuario.getId()))
            throw new RuntimeException("Você não tem permissão para editar este produto.");

        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        return salvarDados(produto, request, produto.getLoja(), categoria);
    }

    @Transactional
    public void deletar(Long produtoId, Usuario usuario) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        if (!produto.getLoja().getUsuario().getId().equals(usuario.getId()))
            throw new RuntimeException("Você não tem permissão para deletar este produto.");

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

    private Produto salvarDados(Produto produto, ProdutoRequest request, Loja loja, Categoria categoria) {
        produto.setLoja(loja);
        produto.setCategoria(categoria);
        produto.setNome(request.nome());
        produto.setDescricao(request.descricao());
        produto.setPrecoAtual(request.precoAtual());
        produto.setUnidadeMedida(request.unidadeMedida());
        produto.setEstoqueAtual(request.estoqueAtual() != null ? request.estoqueAtual() : 0);
        produto.setImagemUrl(request.imagemUrl());
        return produtoRepository.save(produto);
    }
}