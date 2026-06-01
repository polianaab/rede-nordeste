package com.semeia_nordeste.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.semeia_nordeste.backend.model.Cartao;

@Repository
public interface CartaoRepository extends JpaRepository<Cartao, Long> {

    List<Cartao> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    Optional<Cartao> findByIdAndUsuarioId(Long id, Long usuarioId);
}
