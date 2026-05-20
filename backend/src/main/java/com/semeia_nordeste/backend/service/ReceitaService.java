package com.semeia_nordeste.backend.service;

import com.semeia_nordeste.backend.dto.ReceitaRequest;
import com.semeia_nordeste.backend.model.*;
import com.semeia_nordeste.backend.repository.*;
import com.semeia_nordeste.backend.security.UsuarioAutenticado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReceitaService {

    private final ReceitaRepository receitaRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioAutenticado usuarioAutenticado;

    public ReceitaService(ReceitaRepository receitaRepository,
            ProdutoRepository produtoRepository,
            UsuarioAutenticado usuarioAutenticado) {
        this.receitaRepository = receitaRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioAutenticado = usuarioAutenticado;
    }

    @Transactional
    public Receita criar(ReceitaRequest request) {
        Usuario logado = usuarioAutenticado.get();

        List<Produto> ingredientes = resolverIngredientes(request.ingredienteIds());

        Receita receita = new Receita();
        receita.setAutor(logado);
        receita.setTitulo(request.titulo());
        receita.setDescricao(request.descricao());
        receita.setModoPreparo(request.modoPreparo());
        receita.setTempoPreparoMin(request.tempoPreparoMin());
        receita.setImagemUrl(request.imagemUrl());
        receita.setIngredientes(ingredientes);

        return receitaRepository.save(receita);
    }

    @Transactional
    public Receita atualizar(Long receitaId, ReceitaRequest request) {
        Usuario logado = usuarioAutenticado.get();

        Receita receita = receitaRepository.findById(receitaId)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada."));

        // Só o autor ou admin pode editar
        boolean isAdmin = usuarioAutenticado.isAdmin();
        boolean isAutor = receita.getAutor().getId().equals(logado.getId());

        if (!isAdmin && !isAutor) {
            throw new SecurityException("Você não tem permissão para editar esta receita.");
        }

        receita.setTitulo(request.titulo());
        receita.setDescricao(request.descricao());
        receita.setModoPreparo(request.modoPreparo());
        receita.setTempoPreparoMin(request.tempoPreparoMin());
        receita.setImagemUrl(request.imagemUrl());
        receita.setIngredientes(resolverIngredientes(request.ingredienteIds()));

        return receitaRepository.save(receita);
    }

    @Transactional
    public void deletar(Long receitaId) {
        Usuario logado = usuarioAutenticado.get();

        Receita receita = receitaRepository.findById(receitaId)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada."));

        boolean isAdmin = usuarioAutenticado.isAdmin();
        boolean isAutor = receita.getAutor().getId().equals(logado.getId());

        if (!isAdmin && !isAutor) {
            throw new SecurityException("Você não tem permissão para deletar esta receita.");
        }

        receitaRepository.delete(receita);
    }

    public Page<Receita> listarTodas(Pageable pageable) {
        return receitaRepository.findAll(pageable);
    }

    public Page<Receita> buscar(String titulo, Pageable pageable) {
        if (titulo != null && !titulo.isBlank())
            return receitaRepository.findByTituloContainingIgnoreCase(titulo, pageable);
        return receitaRepository.findAll(pageable);
    }

    public Receita buscarPorId(Long id) {
        return receitaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada."));
    }

    public Page<Receita> listarMinhas(Pageable pageable) {
        return receitaRepository.findByAutorId(
                usuarioAutenticado.getId(), pageable);
    }

    // ── Helper: resolve lista de IDs em entidades Produto ────────
    private List<Produto> resolverIngredientes(List<Long> ids) {
        if (ids == null || ids.isEmpty())
            return List.of();

        List<Produto> encontrados = produtoRepository.findAllById(ids);

        // Valida se todos os IDs existem
        if (encontrados.size() != ids.size()) {
            List<Long> encontradosIds = encontrados.stream()
                    .map(Produto::getId).toList();
            List<Long> naoEncontrados = ids.stream()
                    .filter(id -> !encontradosIds.contains(id))
                    .toList();
            throw new RuntimeException(
                    "Produtos não encontrados: " + naoEncontrados);
        }

        return encontrados;
    }
}