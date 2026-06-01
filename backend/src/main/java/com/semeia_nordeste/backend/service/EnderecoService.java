package com.semeia_nordeste.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.EnderecoRequest;
import com.semeia_nordeste.backend.exception.NotFoundException;
import com.semeia_nordeste.backend.model.Endereco;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.EnderecoRepository;

@Service
public class EnderecoService {

    private final EnderecoRepository repository;

    public EnderecoService(EnderecoRepository repository) {
        this.repository = repository;
    }

    public List<Endereco> listar(Usuario usuario) {
        return repository.findByUsuarioIdOrderByPrincipalDescDataCriacaoDesc(usuario.getId());
    }

    @Transactional
    public Endereco criar(EnderecoRequest req, Usuario usuario) {
        Endereco e = new Endereco();
        e.setUsuario(usuario);
        aplicar(e, req);

        // Se é o primeiro endereço, marca como principal
        boolean ehPrimeiro = repository.countByUsuarioId(usuario.getId()) == 0;
        if (ehPrimeiro || Boolean.TRUE.equals(req.principal())) {
            e.setPrincipal(true);
        }

        Endereco salvo = repository.save(e);
        if (Boolean.TRUE.equals(salvo.getPrincipal())) {
            repository.desmarcarOutrosComoPrincipal(usuario.getId(), salvo.getId());
        }
        return salvo;
    }

    @Transactional
    public Endereco atualizar(Long id, EnderecoRequest req, Usuario usuario) {
        Endereco e = repository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new NotFoundException("Endereço não encontrado."));
        aplicar(e, req);
        if (Boolean.TRUE.equals(req.principal())) {
            e.setPrincipal(true);
            repository.desmarcarOutrosComoPrincipal(usuario.getId(), e.getId());
        }
        return repository.save(e);
    }

    @Transactional
    public void deletar(Long id, Usuario usuario) {
        Endereco e = repository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new NotFoundException("Endereço não encontrado."));
        repository.delete(e);
    }

    private void aplicar(Endereco e, EnderecoRequest req) {
        e.setDestinatario(req.destinatario());
        e.setTelefone(req.telefone());
        e.setCep(req.cep());
        e.setEstadoCidade(req.estadoCidade());
        e.setBairro(req.bairro());
        e.setRua(req.rua());
        e.setNumero(req.numero());
        e.setComplemento(req.complemento());
        e.setLatitudeDestino(req.latitudeDestino());
        e.setLongitudeDestino(req.longitudeDestino());
    }
}
