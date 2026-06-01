package com.semeia_nordeste.backend.service;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.exception.UnauthorizedException;
import com.semeia_nordeste.backend.model.Sessao;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.SessaoRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class SessaoService {

    private static final long REFRESH_TTL_HORAS = 24;

    private final SessaoRepository sessaoRepository;

    public SessaoService(SessaoRepository sessaoRepository) {
        this.sessaoRepository = sessaoRepository;
    }

    @Transactional
    public Sessao criar(Usuario usuario, String refreshToken, HttpServletRequest request) {
        Sessao sessao = new Sessao();
        sessao.setUsuario(usuario);
        sessao.setRefreshToken(refreshToken);
        sessao.setUserAgent(request != null ? request.getHeader("User-Agent") : null);
        sessao.setIp(extrairIp(request));
        sessao.setCriadoEm(OffsetDateTime.now());
        sessao.setExpiraEm(OffsetDateTime.now().plusHours(REFRESH_TTL_HORAS));
        sessao.setUltimoUsoEm(OffsetDateTime.now());
        return sessaoRepository.save(sessao);
    }

    /**
     * Rotaciona a sessão: revoga a antiga e cria uma nova com o novo refresh token.
     * Lança UnauthorizedException se a sessão original não existe ou foi revogada.
     */
    @Transactional
    public Sessao rotacionar(String tokenAntigo, String tokenNovo, Usuario usuario, HttpServletRequest request) {
        Sessao antiga = sessaoRepository.findByRefreshToken(tokenAntigo)
                .orElseThrow(() -> new UnauthorizedException("Refresh token inválido."));

        if (!antiga.isValida())
            throw new UnauthorizedException("Sessão expirada ou revogada.");

        antiga.setRevogadoEm(OffsetDateTime.now());
        sessaoRepository.save(antiga);

        return criar(usuario, tokenNovo, request);
    }

    @Transactional
    public void revogarPorToken(String refreshToken) {
        sessaoRepository.revogarPorToken(refreshToken, OffsetDateTime.now());
    }

    @Transactional
    public int revogarTodasDoUsuario(Long usuarioId) {
        return sessaoRepository.revogarTodasDoUsuario(usuarioId, OffsetDateTime.now());
    }

    public List<Sessao> listarAtivasDoUsuario(Long usuarioId) {
        return sessaoRepository.findByUsuarioIdAndRevogadoEmIsNull(usuarioId);
    }

    private String extrairIp(HttpServletRequest request) {
        if (request == null) return null;
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank())
            return forwarded.split(",")[0].trim();
        return request.getRemoteAddr();
    }
}
