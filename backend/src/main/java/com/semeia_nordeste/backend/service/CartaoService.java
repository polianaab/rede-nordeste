package com.semeia_nordeste.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.dto.CartaoRequest;
import com.semeia_nordeste.backend.exception.NotFoundException;
import com.semeia_nordeste.backend.model.Cartao;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.CartaoRepository;

@Service
public class CartaoService {

    private final CartaoRepository repository;

    public CartaoService(CartaoRepository repository) {
        this.repository = repository;
    }

    public List<Cartao> listar(Usuario usuario) {
        return repository.findByUsuarioIdOrderByDataCriacaoDesc(usuario.getId());
    }

    @Transactional
    public Cartao criar(CartaoRequest req, Usuario usuario) {
        String numeroLimpo = req.numero().replaceAll("\\D", "");
        String final4 = numeroLimpo.substring(numeroLimpo.length() - 4);
        String bandeira = detectarBandeira(numeroLimpo);

        Cartao c = new Cartao();
        c.setUsuario(usuario);
        c.setTitular(req.titular().toUpperCase());
        c.setFinalCartao(final4);
        c.setBandeira(bandeira);
        c.setValidade(req.validade());
        // PAN completo e CVV NÃO são persistidos — ver javadoc do Cartao.

        return repository.save(c);
    }

    @Transactional
    public void deletar(Long id, Usuario usuario) {
        Cartao c = repository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new NotFoundException("Cartão não encontrado."));
        repository.delete(c);
    }

    /**
     * Detecção simples de bandeira pelo BIN. Em produção, use um serviço
     * dedicado (Stripe/Pagar.me retornam isso na tokenização).
     */
    private String detectarBandeira(String numero) {
        if (numero.isEmpty()) return "Desconhecido";
        char primeiro = numero.charAt(0);
        if (primeiro == '4') return "Visa";
        if (primeiro == '5') return "Mastercard";
        if (primeiro == '3') return "Amex";
        if (primeiro == '6') return "Elo";
        return "Outro";
    }
}
