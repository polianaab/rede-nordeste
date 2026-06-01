package com.semeia_nordeste.backend.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.MetricasAdminResponse;
import com.semeia_nordeste.backend.dto.UsuarioAdminUpdateRequest;
import com.semeia_nordeste.backend.exception.BusinessException;
import com.semeia_nordeste.backend.exception.NotFoundException;
import com.semeia_nordeste.backend.model.Loja;
import com.semeia_nordeste.backend.model.StatusProduto;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.CategoriaRepository;
import com.semeia_nordeste.backend.repository.LojaRepository;
import com.semeia_nordeste.backend.repository.PedidoRepository;
import com.semeia_nordeste.backend.repository.ProdutoRepository;
import com.semeia_nordeste.backend.repository.UsuarioRepository;

@Service
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final LojaRepository lojaRepository;
    private final ProdutoRepository produtoRepository;
    private final PedidoRepository pedidoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SessaoService sessaoService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminService(UsuarioRepository usuarioRepository,
            LojaRepository lojaRepository,
            ProdutoRepository produtoRepository,
            PedidoRepository pedidoRepository,
            CategoriaRepository categoriaRepository,
            SessaoService sessaoService,
            BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.lojaRepository = lojaRepository;
        this.produtoRepository = produtoRepository;
        this.pedidoRepository = pedidoRepository;
        this.categoriaRepository = categoriaRepository;
        this.sessaoService = sessaoService;
        this.passwordEncoder = passwordEncoder;
    }

    public MetricasAdminResponse metricas() {
        long usuarios = usuarioRepository.count();
        long compradores = usuarioRepository.findAll().stream()
                .filter(u -> u.getTipoPerfil().name().equals("COMPRADOR")).count();
        long produtores = usuarioRepository.findAll().stream()
                .filter(u -> u.getTipoPerfil().name().equals("PRODUTOR")).count();
        long lojasVerificadas = lojaRepository.countByVerificadaTrueAndSuspensaFalse();
        long lojasPendentes = lojaRepository.count() - lojasVerificadas;
        long produtosAprovados = produtoRepository.findAll().stream()
                .filter(p -> p.getStatus() == StatusProduto.APROVADO).count();
        long produtosPendentes = produtoRepository.findAll().stream()
                .filter(p -> p.getStatus() == StatusProduto.PENDENTE).count();
        long pedidos = pedidoRepository.count();
        BigDecimal vendas = pedidoRepository.findAll().stream()
                .map(p -> p.getValorTotal() != null ? p.getValorTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long categorias = categoriaRepository.count();

        return new MetricasAdminResponse(
                usuarios, compradores, produtores,
                lojasVerificadas, lojasPendentes,
                produtosAprovados, produtosPendentes,
                pedidos, vendas, categorias);
    }

    // ── USUÁRIOS ────────────────────────────────────────────────
    public Page<Usuario> listarUsuarios(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }

    @Transactional
    public Usuario atualizarUsuario(Long id, UsuarioAdminUpdateRequest req) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));

        if (req.contaAtiva() != null) {
            usuario.setContaAtiva(req.contaAtiva());
            if (Boolean.FALSE.equals(req.contaAtiva())) {
                // Revoga todas as sessões ativas ao suspender
                sessaoService.revogarTodasDoUsuario(id);
                usuario.setMotivoSuspensao(req.motivoSuspensao());
            } else {
                usuario.setMotivoSuspensao(null);
            }
        }
        if (req.tipoPerfil() != null) {
            usuario.setTipoPerfil(req.tipoPerfil());
            // Mudou de perfil → revoga sessões para forçar novo login com claims atualizadas.
            sessaoService.revogarTodasDoUsuario(id);
        }
        if (req.novaSenha() != null && !req.novaSenha().isBlank()) {
            if (req.novaSenha().length() < 8)
                throw new BusinessException("A nova senha deve ter no mínimo 8 caracteres.");
            usuario.setSenhaHash(passwordEncoder.encode(req.novaSenha()));
            sessaoService.revogarTodasDoUsuario(id);
        }
        return usuarioRepository.save(usuario);
    }

    // ── LOJAS ───────────────────────────────────────────────────
    public Page<Loja> listarLojasPendentes(Pageable pageable) {
        return lojaRepository.findByVerificadaFalseAndSuspensaFalse(pageable);
    }

    public Page<Loja> listarTodasLojas(Pageable pageable) {
        return lojaRepository.findAll(pageable);
    }

    @Transactional
    public Loja verificarLoja(Long id) {
        Loja loja = lojaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Loja não encontrada."));
        loja.setVerificada(true);
        loja.setSuspensa(false);
        loja.setDataVerificacao(OffsetDateTime.now());
        loja.setMotivoSuspensao(null);
        return lojaRepository.save(loja);
    }

    @Transactional
    public Loja suspenderLoja(Long id, String motivo) {
        Loja loja = lojaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Loja não encontrada."));
        loja.setSuspensa(true);
        loja.setMotivoSuspensao(motivo);
        return lojaRepository.save(loja);
    }

    @Transactional
    public Loja reativarLoja(Long id) {
        Loja loja = lojaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Loja não encontrada."));
        loja.setSuspensa(false);
        loja.setMotivoSuspensao(null);
        return lojaRepository.save(loja);
    }
}
