package com.semeia_nordeste.backend.repository;

import com.semeia_nordeste.backend.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByCompradorIdAndLojaId(Long compradorId, Long lojaId);

    // Todos os chats de um comprador
    List<Chat> findByCompradorIdOrderByDataInicioDesc(Long compradorId);

    // Todos os chats da loja de um produtor
    List<Chat> findByLoja_Usuario_IdOrderByDataInicioDesc(Long usuarioId);

    // Conta mensagens não lidas de um chat para um usuário
    @Query("""
                SELECT COUNT(m) FROM Mensagem m
                WHERE m.chat.id = :chatId
                AND m.lida = false
                AND m.remetente.id != :usuarioId
            """)
    long contarNaoLidas(Long chatId, Long usuarioId);
}