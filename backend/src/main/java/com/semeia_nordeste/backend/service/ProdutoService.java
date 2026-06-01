package com.semeia_nordeste.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.ProdutoRequest;
import com.semeia_nordeste.backend.dto.StatusProdutoRequest;
import com.semeia_nordeste.backend.exception.BusinessException;
import com.semeia_nordeste.backend.exception.ForbiddenException;
import com.semeia_nordeste.backend.exception.NotFoundException;
import com.semeia_nordeste.backend.model.Categoria;
import com.semeia_nordeste.backend.model.Loja;
import com.semeia_nordeste.backend.model.Produto;
import com.semeia_nordeste.backend.model.StatusProduto;
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
                                .orElseThrow(() -> new BusinessException(
                                                "Você precisa cadastrar uma loja antes de adicionar produtos."));

                Categoria categoria = categoriaRepository.findById(request.categoriaId())
                                .orElseThrow(() -> new NotFoundException("Categoria não encontrada."));

                return salvarDados(new Produto(), request, loja, categoria);
        }

        @Transactional
        public Produto atualizar(Long produtoId, ProdutoRequest request) {
                var logado = usuarioAutenticado.get();

                Produto produto = produtoRepository.findById(produtoId)
                                .orElseThrow(() -> new NotFoundException("Produto não encontrado."));

                boolean isAdmin = usuarioAutenticado.isAdmin();
                boolean isDono = produto.getLoja().getUsuario().getId().equals(logado.getId());

                if (!isAdmin && !isDono)
                        throw new ForbiddenException("Você não tem permissão para editar este produto.");

                Categoria categoria = categoriaRepository.findById(request.categoriaId())
                                .orElseThrow(() -> new NotFoundException("Categoria não encontrada."));

                return salvarDados(produto, request, produto.getLoja(), categoria);
        }

        @Transactional
        public void deletar(Long produtoId) {
                var logado = usuarioAutenticado.get();

                Produto produto = produtoRepository.findById(produtoId)
                                .orElseThrow(() -> new NotFoundException("Produto não encontrado."));

                boolean isAdmin = usuarioAutenticado.isAdmin();
                boolean isDono = produto.getLoja().getUsuario().getId().equals(logado.getId());

                if (!isAdmin && !isDono)
                        throw new ForbiddenException("Você não tem permissão para deletar este produto.");

                produtoRepository.delete(produto);
        }

        // Marketplace — combina nome + categoriaId. Sempre filtra por status APROVADO.
        // termo é "" (nunca null) quando não há busca — evita o erro lower(bytea) no
        // PostgreSQL. Ver javadoc de ProdutoRepository.buscarMarketplace.
        public Page<Produto> buscar(String nome, Long categoriaId, Pageable pageable) {
                String termo = (nome != null && !nome.isBlank()) ? nome.trim() : "";
                return produtoRepository.buscarMarketplace(StatusProduto.APROVADO, termo, categoriaId, pageable);
        }

        public Page<Produto> listarPorLoja(Long lojaId, Pageable pageable) {
                return produtoRepository.findByLojaId(lojaId, pageable);
        }

        public Produto buscarPorId(Long id) {
                return produtoRepository.findById(id)
                                .orElseThrow(() -> new NotFoundException("Produto não encontrado."));
        }

        public List<Produto> listarParaHome() {
                return produtoRepository.findUmPorLoja();
        }

        public Page<Produto> listarPendentes(Pageable pageable) {
                return produtoRepository.findByStatusOrderByDataCadastroAsc(
                                StatusProduto.PENDENTE, pageable);
        }

        @Transactional
        public Produto atualizarStatus(Long produtoId, StatusProdutoRequest request) {
                Produto produto = produtoRepository.findById(produtoId)
                                .orElseThrow(() -> new NotFoundException("Produto não encontrado."));

                produto.setStatus(request.status());
                return produtoRepository.save(produto);
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
                if (p.getId() == null)
                        // Decisão de produto: novo produto nasce APROVADO para destravar a vitrine.
                        // ADMIN ainda pode REJEITAR a posteriori via PATCH /admin/produtos/{id}/status.
                        p.setStatus(StatusProduto.APROVADO);
                return produtoRepository.save(p);
        }
}
