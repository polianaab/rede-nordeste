package com.semeia_nordeste.backend.service;

import com.semeia_nordeste.backend.dto.EntregadorRequest;
import com.semeia_nordeste.backend.model.*;
import com.semeia_nordeste.backend.repository.EntregadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class EntregadorService {

    private final EntregadorRepository entregadorRepository;
    private final FreteService freteService;

    public EntregadorService(EntregadorRepository entregadorRepository,
            FreteService freteService) {
        this.entregadorRepository = entregadorRepository;
        this.freteService = freteService;
    }

    @Transactional
    public Entregador cadastrar(EntregadorRequest request) {
        if (entregadorRepository.existsByCpf(request.cpf()))
            throw new RuntimeException("CPF já cadastrado.");

        // CNH obrigatória para veículos motorizados exceto bicicleta
        if (request.tipoVeiculo() != TipoVeiculo.BICICLETA
                && (request.numeroCnh() == null || request.numeroCnh().isBlank()))
            throw new RuntimeException("CNH obrigatória para este tipo de veículo.");

        Entregador e = new Entregador();
        e.setNomeCompleto(request.nomeCompleto());
        e.setCpf(request.cpf());
        e.setTelefone(request.telefone());
        e.setCidade(request.cidade());
        e.setLatitudeBase(request.latitudeBase());
        e.setLongitudeBase(request.longitudeBase());
        e.setTipoVeiculo(request.tipoVeiculo());
        e.setPlacaVeiculo(request.placaVeiculo());
        e.setNumeroCnh(request.numeroCnh());
        e.setAtivo(false); // admin aprova
        return entregadorRepository.save(e);
    }

    /**
     * Encontra o entregador mais adequado para o pedido:
     * — tipo de veículo compatível
     * — ativo e disponível
     * — mais próximo da loja (origem)
     */
    public Entregador encontrarMaisAdequado(TipoVeiculo veiculoNecessario,
            double latOrigem,
            double lonOrigem) {
        List<Entregador> candidatos = entregadorRepository
                .findByTipoVeiculoAndAtivoTrueAndDisponivelTrue(veiculoNecessario);

        // Fallback: aceita veículos maiores se não houver o ideal
        if (candidatos.isEmpty()) {
            candidatos = entregadorRepository.findByAtivoTrueAndDisponivelTrue()
                    .stream()
                    .filter(e -> capacidadeCompativel(e.getTipoVeiculo(), veiculoNecessario))
                    .toList();
        }

        if (candidatos.isEmpty())
            throw new RuntimeException(
                    "Nenhum entregador disponível para este tipo de entrega no momento.");

        // Ordena pelo mais próximo da origem
        return candidatos.stream()
                .filter(e -> e.getLatitudeBase() != null && e.getLongitudeBase() != null)
                .min(Comparator.comparing(e -> freteService.calcularDistanciaKm(
                        latOrigem, lonOrigem,
                        e.getLatitudeBase(), e.getLongitudeBase())))
                .orElse(candidatos.get(0));
    }

    // Verifica se o veículo do entregador tem capacidade >= ao necessário
    private boolean capacidadeCompativel(TipoVeiculo disponivel, TipoVeiculo necessario) {
        return disponivel.ordinal() >= necessario.ordinal();
    }

    @Transactional
    public void alterarDisponibilidade(Long id, boolean disponivel) {
        Entregador e = entregadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entregador não encontrado."));
        e.setDisponivel(disponivel);
        entregadorRepository.save(e);
    }

    @Transactional
    public void aprovar(Long id) {
        Entregador e = entregadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entregador não encontrado."));
        e.setAtivo(true);
        entregadorRepository.save(e);
    }
}