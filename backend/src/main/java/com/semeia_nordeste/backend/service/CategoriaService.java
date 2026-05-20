package com.semeia_nordeste.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.CategoriaRequest;
import com.semeia_nordeste.backend.model.Categoria;
import com.semeia_nordeste.backend.repository.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    @Transactional
    public Categoria criar(CategoriaRequest request) {
        if (categoriaRepository.existsByNome(request.nome()))
            throw new RuntimeException("Categoria já cadastrada.");

        Categoria categoria = new Categoria();
        categoria.setNome(request.nome());
        categoria.setDescricao(request.descricao());
        categoria.setImagemIconeUrl(request.imagemIconeUrl());
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public Categoria atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));
        categoria.setNome(request.nome());
        categoria.setDescricao(request.descricao());
        categoria.setImagemIconeUrl(request.imagemIconeUrl());
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public void deletar(Long id) {
        if (!categoriaRepository.existsById(id))
            throw new RuntimeException("Categoria não encontrada.");
        categoriaRepository.deleteById(id);
    }
}