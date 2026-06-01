package com.semeia_nordeste.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.BannerRequest;
import com.semeia_nordeste.backend.dto.BannerResponse;
import com.semeia_nordeste.backend.exception.NotFoundException;
import com.semeia_nordeste.backend.model.Banner;
import com.semeia_nordeste.backend.repository.BannerRepository;

@Service
public class BannerService {

    private final BannerRepository repo;

    public BannerService(BannerRepository repo) {
        this.repo = repo;
    }

    public List<BannerResponse> listarAtivos() {
        return repo.findByAtivoTrueOrderByOrdemAscDataCriacaoDesc()
                .stream().map(BannerResponse::fromEntity).toList();
    }

    public List<BannerResponse> listarTodos() {
        return repo.findAllByOrderByOrdemAscDataCriacaoDesc()
                .stream().map(BannerResponse::fromEntity).toList();
    }

    @Transactional
    public BannerResponse criar(BannerRequest req) {
        Banner b = new Banner();
        aplicarCampos(b, req);
        return BannerResponse.fromEntity(repo.save(b));
    }

    @Transactional
    public BannerResponse atualizar(Long id, BannerRequest req) {
        Banner b = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Banner não encontrado."));
        aplicarCampos(b, req);
        return BannerResponse.fromEntity(repo.save(b));
    }

    @Transactional
    public void deletar(Long id) {
        if (!repo.existsById(id))
            throw new NotFoundException("Banner não encontrado.");
        repo.deleteById(id);
    }

    private void aplicarCampos(Banner b, BannerRequest req) {
        if (req.tipo() != null) b.setTipo(req.tipo());
        b.setTitulo(req.titulo());
        b.setSubtitulo(req.subtitulo());
        b.setImagemUrl(req.imagemUrl());
        if (req.corDestaque() != null) b.setCorDestaque(req.corDestaque());
        b.setLinkBlogId(req.linkBlogId());
        if (req.ordem() != null) b.setOrdem(req.ordem());
        if (req.ativo() != null) b.setAtivo(req.ativo());
    }
}
