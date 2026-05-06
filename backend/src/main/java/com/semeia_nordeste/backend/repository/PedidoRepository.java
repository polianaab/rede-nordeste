package com.semeia_nordeste.backend.repository;

import com.semeia_nordeste.backend.model.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Page<Pedido> findByCompradorId(Long compradorId, Pageable pageable);

    Page<Pedido> findByItens_Produto_Loja_UsuarioId(Long usuarioId, Pageable pageable);
}