package com.semeia_nordeste.backend.repository;

import com.semeia_nordeste.backend.model.Mensagem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    // Mensagens paginadas de um chat (mais antigas primeiro)
    Page<Mensagem> findByChatIdOrderByDataEnvioAsc(Long chatId, Pageable pageable);

    // Última mensagem do chat — usada para preview na lista de conversas
    Mensagem findFirstByChatIdOrderByDataEnvioDesc(Long chatId);

    // Marca todas as mensagens de outro remetente como lidas
    @Modifying
    @Query("""
                UPDATE Mensagem m SET m.lida = true
                WHERE m.chat.id = :chatId
                AND m.remetente.id != :usuarioId
                AND m.lida = false
            """)
    void marcarTodasComoLidas(Long chatId, Long usuarioId);

    // Total de não lidas de um usuário em todos os chats
    @Query("""
                SELECT COUNT(m) FROM Mensagem m
                WHERE m.lida = false
                AND m.remetente.id != :usuarioId
                AND m.chat.id IN (
                    SELECT c.id FROM Chat c
                    WHERE c.comprador.id = :usuarioId
                    OR c.loja.usuario.id = :usuarioId
                )
            """)
    long totalNaoLidasDoUsuario(Long usuarioId);
}