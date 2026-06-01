package com.semeia_nordeste.backend.service;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.exception.NotFoundException;
import com.semeia_nordeste.backend.model.Notificacao;
import com.semeia_nordeste.backend.model.TipoNotificacao;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.NotificacaoRepository;

@Service
public class NotificacaoService {

    private final NotificacaoRepository repository;

    public NotificacaoService(NotificacaoRepository repository) {
        this.repository = repository;
    }

    public List<Notificacao> listar(Usuario usuario) {
        return repository.findByUsuarioIdOrderByDataCriacaoDesc(usuario.getId());
    }

    public long contarNaoLidas(Usuario usuario) {
        return repository.countByUsuarioIdAndLidaFalse(usuario.getId());
    }

    @Transactional
    public Notificacao marcarComoLida(Long id, Usuario usuario) {
        Notificacao n = repository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new NotFoundException("Notificação não encontrada."));
        if (!Boolean.TRUE.equals(n.getLida())) {
            n.setLida(true);
            n.setDataLeitura(OffsetDateTime.now());
        }
        return repository.save(n);
    }

    @Transactional
    public void marcarTodasComoLidas(Usuario usuario) {
        repository.marcarTodasComoLidas(usuario.getId());
    }

    @Transactional
    public void deletar(Long id, Usuario usuario) {
        Notificacao n = repository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new NotFoundException("Notificação não encontrada."));
        repository.delete(n);
    }

    @Transactional
    public void limparTodas(Usuario usuario) {
        repository.deletarTodasDoUsuario(usuario.getId());
    }

    /**
     * Helper para outros services dispararem notificações (ex: PedidoService
     * pode criar uma "Pedido a caminho" quando muda o status da entrega).
     */
    @Transactional
    public Notificacao notificar(Usuario destinatario, TipoNotificacao tipo, String titulo, String mensagem, String linkAcao) {
        Notificacao n = new Notificacao();
        n.setUsuario(destinatario);
        n.setTipo(tipo);
        n.setTitulo(titulo);
        n.setMensagem(mensagem);
        n.setLinkAcao(linkAcao);
        return repository.save(n);
    }
}
