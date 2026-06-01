package com.semeia_nordeste.backend.config;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Rate limiting in-memory para endpoints de autenticação.
 *
 * Aplicado a:
 *  • POST /api/usuarios/login     → 5 requisições / minuto por IP
 *  • POST /api/usuarios/registrar → 3 requisições / minuto por IP
 *
 * Por que in-memory (sem Bucket4j / Redis):
 *   • Zero dependência nova — sliding window com ConcurrentLinkedDeque.
 *   • Suficiente para 1 instância (modo monolito didático).
 *   • Em produção real com múltiplas instâncias, migrar para
 *     Redis + Bucket4j (rate limit DISTRIBUÍDO, não local por instância).
 *
 * Resposta quando excede: HTTP 429 com mensagem em PT-BR para a UI.
 *
 * Limitação conhecida: usa apenas o IP. Em rede corporativa atrás de NAT,
 * múltiplos usuários compartilham IP — o limite é por NAT, não por pessoa.
 * Para chave por usuário+IP precisaria de identidade que aqui ainda não temos
 * (o /login é o próprio momento em que a identidade aparece).
 */
@Component
@Order(1) // antes do SecurityFilter
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Duration JANELA = Duration.ofMinutes(1);
    private static final int LIMITE_LOGIN = 5;
    private static final int LIMITE_REGISTRO = 3;

    private final ConcurrentHashMap<String, Deque<Instant>> historico = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String uri = request.getRequestURI();
        int limite;
        if (uri.endsWith("/api/usuarios/login")) {
            limite = LIMITE_LOGIN;
        } else if (uri.endsWith("/api/usuarios/registrar")) {
            limite = LIMITE_REGISTRO;
        } else {
            chain.doFilter(request, response);
            return;
        }

        String chave = uri + "|" + ipDoRequest(request);
        if (excedeuLimite(chave, limite)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(
                "{\"status\":429,\"message\":\"Muitas tentativas. Tente novamente em 1 minuto.\"," +
                "\"erro\":\"Muitas tentativas. Tente novamente em 1 minuto.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean excedeuLimite(String chave, int limite) {
        Instant agora = Instant.now();
        Instant inicioJanela = agora.minus(JANELA);

        Deque<Instant> deque = historico.computeIfAbsent(chave, k -> new ConcurrentLinkedDeque<>());

        // Remove timestamps antigos (sliding window)
        while (!deque.isEmpty() && deque.peekFirst() != null && deque.peekFirst().isBefore(inicioJanela)) {
            deque.pollFirst();
        }

        if (deque.size() >= limite) {
            return true;
        }
        deque.addLast(agora);
        return false;
    }

    private String ipDoRequest(HttpServletRequest request) {
        // Considera proxy reverso (X-Forwarded-For) — em prod precisa
        // ser configurado no Spring para confiar nesse header.
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
