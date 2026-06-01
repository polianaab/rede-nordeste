package com.semeia_nordeste.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.semeia_nordeste.backend.model.Notificacao;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    Optional<Notificacao> findByIdAndUsuarioId(Long id, Long usuarioId);

    long countByUsuarioIdAndLidaFalse(Long usuarioId);

    @Modifying
    @Query("UPDATE Notificacao n SET n.lida = true, n.dataLeitura = CURRENT_TIMESTAMP " +
           "WHERE n.usuario.id = :usuarioId AND n.lida = false")
    int marcarTodasComoLidas(@Param("usuarioId") Long usuarioId);

    @Modifying
    @Query("DELETE FROM Notificacao n WHERE n.usuario.id = :usuarioId")
    int deletarTodasDoUsuario(@Param("usuarioId") Long usuarioId);
}
