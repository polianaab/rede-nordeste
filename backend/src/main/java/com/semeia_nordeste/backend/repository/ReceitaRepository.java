package com.semeia_nordeste.backend.repository;

import com.semeia_nordeste.backend.model.Receita;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    Page<Receita> findByAutorId(Long autorId, Pageable pageable);

    Page<Receita> findByTituloContainingIgnoreCase(String titulo, Pageable pageable);
}