package com.semeia_nordeste.backend.security;

import com.semeia_nordeste.backend.model.Usuario;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioAutenticado {

    /**
     * Retorna o usuário logado extraído do SecurityContext.
     * O SecurityFilter já populou o contexto com o objeto Usuario completo.
     */
    public Usuario get() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Usuário não autenticado.");
        }

        if (!(authentication.getPrincipal() instanceof Usuario usuario)) {
            throw new SecurityException("Principal inválido no contexto de segurança.");
        }

        return usuario;
    }

    public Long getId() {
        return get().getId();
    }

    public boolean isAdmin() {
        return get().getTipoPerfil().name().equals("ADMIN");
    }
}