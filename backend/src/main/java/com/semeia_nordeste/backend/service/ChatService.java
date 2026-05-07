package com.semeia_nordeste.backend.service;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.ChatResponse;
import com.semeia_nordeste.backend.dto.MensagemRequest;
import com.semeia_nordeste.backend.dto.MensagemResponse;
import com.semeia_nordeste.backend.dto.NotificacaoDTO;
import com.semeia_nordeste.backend.model.Chat;
import com.semeia_nordeste.backend.model.Loja;
import com.semeia_nordeste.backend.model.Mensagem;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.ChatRepository;
import com.semeia_nordeste.backend.repository.LojaRepository;
import com.semeia_nordeste.backend.repository.MensagemRepository;
import com.semeia_nordeste.backend.repository.UsuarioRepository;

@Service
public class ChatService {

        private final ChatRepository chatRepository;
        private final MensagemRepository mensagemRepository;
        private final UsuarioRepository usuarioRepository;
        private final LojaRepository lojaRepository;
        private final SimpMessagingTemplate messagingTemplate;

        public ChatService(ChatRepository chatRepository,
                        MensagemRepository mensagemRepository,
                        UsuarioRepository usuarioRepository,
                        LojaRepository lojaRepository,
                        SimpMessagingTemplate messagingTemplate) {
                this.chatRepository = chatRepository;
                this.mensagemRepository = mensagemRepository;
                this.usuarioRepository = usuarioRepository;
                this.lojaRepository = lojaRepository;
                this.messagingTemplate = messagingTemplate;
        }

        /**
         * Abre ou retorna um chat existente entre comprador e loja.
         * Idempotente — chamadas repetidas retornam o mesmo chat.
         */
        @Transactional
        public Chat abrirOuRetornarChat(Long compradorId, Long lojaId) {
                return chatRepository
                                .findByCompradorIdAndLojaId(compradorId, lojaId)
                                .orElseGet(() -> {
                                        Usuario comprador = usuarioRepository.findById(compradorId)
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Comprador não encontrado."));
                                        Loja loja = lojaRepository.findById(lojaId)
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Loja não encontrada."));

                                        Chat novo = new Chat();
                                        novo.setComprador(comprador);
                                        novo.setLoja(loja);
                                        return chatRepository.save(novo);
                                });
        }

        @Transactional
        public MensagemResponse enviarMensagem(Long chatId,
                        MensagemRequest request,
                        Usuario remetente) {
                Chat chat = chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat não encontrado."));

                validarParticipante(chat, remetente);

                Mensagem mensagem = new Mensagem();
                mensagem.setChat(chat);
                mensagem.setRemetente(remetente);
                mensagem.setConteudo(request.conteudo());
                mensagem.setDataEnvio(OffsetDateTime.now());
                mensagem.setLida(false);

                Mensagem salva = mensagemRepository.save(mensagem);
                MensagemResponse response = MensagemResponse.fromEntity(salva);

                // ── Notifica via WebSocket ──────────────────────────────────
                // Todos os participantes do chat recebem em /topic/chat/{chatId}
                messagingTemplate.convertAndSend(
                                "/topic/chat/" + chatId,
                                response);

                // Notificação de badge para o destinatário
                Long destinatarioId = resolverDestinatario(chat, remetente);
                messagingTemplate.convertAndSendToUser(
                                destinatarioId.toString(),
                                "/queue/notificacoes",
                                new NotificacaoDTO(chatId, remetente.getNomeCompleto(), request.conteudo()));

                return response;
        }

        /**
         * Lista mensagens de um chat com paginação.
         */
        @Transactional
        public Page<MensagemResponse> listarMensagens(Long chatId,
                        Usuario usuario,
                        Pageable pageable) {
                Chat chat = chatRepository.findById(chatId)
                                .orElseThrow(() -> new RuntimeException("Chat não encontrado."));

                validarParticipante(chat, usuario);

                mensagemRepository.marcarTodasComoLidas(chatId, usuario.getId());

                return mensagemRepository
                                .findByChatIdOrderByDataEnvioAsc(chatId, pageable)
                                .map(MensagemResponse::fromEntity);
        }

        /**
         * Lista todos os chats do comprador com badge de não lidas.
         */
        public List<ChatResponse> listarChatsDoComprador(Usuario usuario) {
                return chatRepository
                                .findByCompradorIdOrderByDataInicioDesc(usuario.getId())
                                .stream()
                                .map(c -> ChatResponse.fromEntity(c,
                                                chatRepository.contarNaoLidas(c.getId(), usuario.getId())))
                                .toList();
        }

        /**
         * Lista todos os chats da loja do produtor.
         */
        public List<ChatResponse> listarChatsDaLoja(Usuario produtor) {
                return chatRepository
                                .findByLoja_Usuario_IdOrderByDataInicioDesc(produtor.getId())
                                .stream()
                                .map(c -> ChatResponse.fromEntity(c,
                                                chatRepository.contarNaoLidas(c.getId(), produtor.getId())))
                                .toList();
        }

        /**
         * Total de mensagens não lidas — usado para badge global no header.
         */
        public long totalNaoLidas(Usuario usuario) {
                return mensagemRepository.totalNaoLidasDoUsuario(usuario.getId());
        }

        private void validarParticipante(Chat chat, Usuario usuario) {
                boolean isComprador = chat.getComprador().getId().equals(usuario.getId());
                boolean isProdutor = chat.getLoja().getUsuario().getId().equals(usuario.getId());
                if (!isComprador && !isProdutor)
                        throw new RuntimeException("Você não participa deste chat.");
        }

        private Long resolverDestinatario(Chat chat, Usuario remetente) {
                if (chat.getComprador().getId().equals(remetente.getId()))
                        return chat.getLoja().getUsuario().getId();
                return chat.getComprador().getId();
        }
}