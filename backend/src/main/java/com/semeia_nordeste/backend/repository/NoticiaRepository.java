package com.semeia_nordeste.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.semeia_nordeste.backend.model.Noticia;

@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
    Page<Noticia> findByPublicadaTrue(Pageable pageable);
}
