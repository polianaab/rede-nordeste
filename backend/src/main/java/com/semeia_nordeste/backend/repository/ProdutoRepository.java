package com.semeia_nordeste.backend.repository;

import com.semeia_nordeste.backend.model.Produto;
import com.semeia_nordeste.backend.model.StatusProduto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // ── Queries existentes — agora filtram por status ─────────────
    Page<Produto> findByLojaId(Long lojaId, Pageable pageable);

    Page<Produto> findByCategoriaId(Long categoriaId, Pageable pageable);

    Page<Produto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    // ── Marketplace — só aprovados ────────────────────────────────
    Page<Produto> findByStatus(StatusProduto status, Pageable pageable);

    Page<Produto> findByStatusAndNomeContainingIgnoreCase(
            StatusProduto status, String nome, Pageable pageable);

    Page<Produto> findByStatusAndCategoriaId(
            StatusProduto status, Long categoriaId, Pageable pageable);

    // ── Painel admin — pendentes aguardando aprovação ─────────────
    Page<Produto> findByStatusOrderByDataCadastroAsc(
            StatusProduto status, Pageable pageable);

    // ── Home estilo Shopee ────────────────────────────────────────
    // Retorna o produto mais recente de cada loja (apenas APROVADOS)
    @Query(value = """
            SELECT DISTINCT ON (p.loja_id) p.*
            FROM produtos p
            WHERE p.status = 'APROVADO'
            ORDER BY p.loja_id, p.data_cadastro DESC
            """, nativeQuery = true)
    List<Produto> findUmPorLoja();
}