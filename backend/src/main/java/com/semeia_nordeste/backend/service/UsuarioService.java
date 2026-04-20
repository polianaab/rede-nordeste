package com.semeia_nordeste.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Transactional
    public Usuario cadastrar(Usuario usuario) {
        if (repository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado no Conecta Nordeste.");
        }

        if (repository.existsByCpfCnpj(usuario.getCpfCnpj())) {
            throw new RuntimeException("CPF/CNPJ já cadastrado.");
        }

        return repository.save(usuario);
    }
}