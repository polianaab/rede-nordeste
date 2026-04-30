package com.semeia_nordeste.backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, BCryptPasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario cadastrar(Usuario usuario) {
        if (repository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado no Conecta Nordeste.");
        }

        if (repository.existsByCpfCnpj(usuario.getCpfCnpj())) {
            throw new RuntimeException("CPF/CNPJ já cadastrado.");
        }

        if (usuario.getSenhaHash() != null && !usuario.getSenhaHash().isEmpty()) {
            String senhaCriptografada = passwordEncoder.encode(usuario.getSenhaHash());
            usuario.setSenhaHash(senhaCriptografada);
        } else {
            throw new RuntimeException("A senha é obrigatória.");
        }

        return repository.save(usuario);
    }

    public Usuario autenticar(String email, String senhaPura) {
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado."));

        if (!passwordEncoder.matches(senhaPura, usuario.getSenhaHash())) {
            throw new RuntimeException("Senha incorreta.");
        }

        return usuario;
    }
}