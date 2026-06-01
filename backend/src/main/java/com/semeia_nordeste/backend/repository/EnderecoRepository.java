package com.semeia_nordeste.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.semeia_nordeste.backend.model.Endereco;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    List<Endereco> findByUsuarioIdOrderByPrincipalDescDataCriacaoDesc(Long usuarioId);

    Optional<Endereco> findByIdAndUsuarioId(Long id, Long usuarioId);

    long countByUsuarioId(Long usuarioId);

    /** Marca todos os outros endereços do usuário como NÃO principais. */
    @Modifying
    @Query("UPDATE Endereco e SET e.principal = false WHERE e.usuario.id = :usuarioId AND e.id <> :excecaoId")
    void desmarcarOutrosComoPrincipal(@Param("usuarioId") Long usuarioId, @Param("excecaoId") Long excecaoId);
}
