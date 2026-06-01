package com.semeia_nordeste.backend.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.semeia_nordeste.backend.model.Sessao;

@Repository
public interface SessaoRepository extends JpaRepository<Sessao, Long> {

    Optional<Sessao> findByRefreshToken(String refreshToken);

    List<Sessao> findByUsuarioIdAndRevogadoEmIsNull(Long usuarioId);

    @Modifying
    @Query("UPDATE Sessao s SET s.revogadoEm = :agora WHERE s.refreshToken = :token AND s.revogadoEm IS NULL")
    int revogarPorToken(@Param("token") String token, @Param("agora") OffsetDateTime agora);

    @Modifying
    @Query("UPDATE Sessao s SET s.revogadoEm = :agora WHERE s.usuario.id = :usuarioId AND s.revogadoEm IS NULL")
    int revogarTodasDoUsuario(@Param("usuarioId") Long usuarioId, @Param("agora") OffsetDateTime agora);
}
