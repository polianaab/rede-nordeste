package com.semeia_nordeste.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.NoticiaRequest;
import com.semeia_nordeste.backend.dto.NoticiaResponse;
import com.semeia_nordeste.backend.exception.NotFoundException;
import com.semeia_nordeste.backend.model.Noticia;
import com.semeia_nordeste.backend.repository.NoticiaRepository;

@Service
public class NoticiaService {

    private final NoticiaRepository repo;

    public NoticiaService(NoticiaRepository repo) {
        this.repo = repo;
    }

    public Page<NoticiaResponse> listarPublicas(Pageable pageable) {
        return repo.findByPublicadaTrue(pageable).map(NoticiaResponse::fromEntity);
    }

    public Page<NoticiaResponse> listarTodas(Pageable pageable) {
        return repo.findAll(pageable).map(NoticiaResponse::fromEntity);
    }

    public NoticiaResponse buscarPorId(Long id) {
        return NoticiaResponse.fromEntity(
                repo.findById(id).orElseThrow(() -> new NotFoundException("Notícia não encontrada.")));
    }

    @Transactional
    public NoticiaResponse criar(NoticiaRequest req) {
        Noticia n = new Noticia();
        aplicarCampos(n, req);
        return NoticiaResponse.fromEntity(repo.save(n));
    }

    @Transactional
    public NoticiaResponse atualizar(Long id, NoticiaRequest req) {
        Noticia n = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Notícia não encontrada."));
        aplicarCampos(n, req);
        return NoticiaResponse.fromEntity(repo.save(n));
    }

    @Transactional
    public void deletar(Long id) {
        if (!repo.existsById(id))
            throw new NotFoundException("Notícia não encontrada.");
        repo.deleteById(id);
    }

    private void aplicarCampos(Noticia n, NoticiaRequest req) {
        n.setTitulo(req.titulo());
        n.setSubtitulo(req.subtitulo());
        if (req.categoria() != null) n.setCategoria(req.categoria());
        n.setImagemUrl(req.imagemUrl());
        n.setDescricao(req.descricao());
        n.setCitacao(req.citacao());
        if (req.tempoLeitura() != null) n.setTempoLeitura(req.tempoLeitura());
        if (req.publicada() != null) n.setPublicada(req.publicada());
    }
}
