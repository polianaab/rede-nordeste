package com.semeia_nordeste.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.semeia_nordeste.backend.model.Entregador;
import com.semeia_nordeste.backend.model.TipoVeiculo;

@Repository
public interface EntregadorRepository extends JpaRepository<Entregador, Long> {
    boolean existsByCpf(String cpf);

    List<Entregador> findByTipoVeiculoAndAtivoTrueAndDisponivelTrue(TipoVeiculo tipo);

    List<Entregador> findByAtivoTrueAndDisponivelTrue();

    List<Entregador> findByAtivoFalse(); // admin vê pendentes
}