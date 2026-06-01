package com.semeia_nordeste.backend.config;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = this.recoverToken(request);

        if (token != null) {
            String email = tokenService.validarToken(token);

            if (email == null) {
                // Token presente porém inválido/expirado → 401 para o front disparar o refresh
                writeUnauthorized(response, "Sessão expirada. Faça login novamente.");
                return;
            }

            Usuario usuario = repository.findByEmail(email).orElse(null);
            if (usuario == null) {
                writeUnauthorized(response, "Usuário do token não encontrado.");
                return;
            }

            var authorities = Collections.singletonList(new SimpleGrantedAuthority(usuario.getTipoPerfil().name()));
            var authentication = new UsernamePasswordAuthenticationToken(usuario, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return null;
        return authHeader.substring(7);
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        String json = "{\"status\":401,\"message\":\"" + message.replace("\"", "\\\"") + "\",\"erro\":\""
                + message.replace("\"", "\\\"") + "\"}";
        response.getWriter().write(json);
    }
}
