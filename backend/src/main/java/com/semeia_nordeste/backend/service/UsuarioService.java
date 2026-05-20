package com.semeia_nordeste.backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.UsuarioRegistroRequest;
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
    public Usuario registrar(UsuarioRegistroRequest request) {
        if (repository.existsByEmail(request.email()))
            throw new RuntimeException("E-mail já cadastrado.");

        if (repository.existsByCpfCnpj(request.cpfCnpj()))
            throw new RuntimeException("CPF/CNPJ já cadastrado.");

        Usuario usuario = new Usuario();
        usuario.setNomeCompleto(request.nomeCompleto());
        usuario.setCpfCnpj(request.cpfCnpj());
        usuario.setTelefone(request.telefone());
        usuario.setEmail(request.email());
        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        usuario.setTipoPerfil(request.tipoPerfil());
        usuario.setContaAtiva(true); // true em produção, posteriormente false, ativar por e-mail futuramente

        return repository.save(usuario);
    }

    public Usuario autenticar(String email, String senhaPura) {
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos."));

        if (!usuario.getContaAtiva())
            throw new RuntimeException("Conta inativa. Entre em contato com o suporte.");

        if (!passwordEncoder.matches(senhaPura, usuario.getSenhaHash()))
            throw new RuntimeException("E-mail ou senha incorretos."); // mesma msg p/ não vazar qual campo errou

        return usuario;
    }
}