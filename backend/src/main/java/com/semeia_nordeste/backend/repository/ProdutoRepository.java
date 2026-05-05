package com.semeia_nordeste.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.semeia_nordeste.backend.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Page<Produto> findByLojaId(Long lojaId, Pageable pageable);

    Page<Produto> findByCategoriaId(Long categoriaId, Pageable pageable);

    // Busca por nome (marketplace)
    Page<Produto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);
}