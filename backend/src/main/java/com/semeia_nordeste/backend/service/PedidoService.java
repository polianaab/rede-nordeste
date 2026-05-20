package com.semeia_nordeste.backend.service;

import com.semeia_nordeste.backend.dto.*;
import com.semeia_nordeste.backend.model.*;
import com.semeia_nordeste.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CarrinhoService carrinhoService;
    private final ProdutoRepository produtoRepository;
    private final FreteService freteService;
    private final EntregadorService entregadorService;
    private final LojaRepository lojaRepository;

    public PedidoService(PedidoRepository pedidoRepository,
            CarrinhoService carrinhoService,
            ProdutoRepository produtoRepository,
            FreteService freteService,
            EntregadorService entregadorService,
            LojaRepository lojaRepository) {
        this.pedidoRepository = pedidoRepository;
        this.carrinhoService = carrinhoService;
        this.produtoRepository = produtoRepository;
        this.freteService = freteService;
        this.entregadorService = entregadorService;
        this.lojaRepository = lojaRepository;
    }

    @Transactional
    public Pedido checkout(CheckoutRequest request, Usuario usuario) {
        List<ItemCarrinho> itensCarrinho = carrinhoService
                .listarItensParaCheckout(usuario.getId());

        if (itensCarrinho.isEmpty())
            throw new RuntimeException("Seu carrinho está vazio.");

        // ── Monta itens e desconta estoque ───────────────────────────────
        List<ItemPedido> itensPedido = itensCarrinho.stream().map(ic -> {
            Produto produto = ic.getProduto();
            if (produto.getEstoqueAtual() < ic.getQuantidade())
                throw new RuntimeException("Estoque insuficiente: " + produto.getNome());

            produto.setEstoqueAtual(produto.getEstoqueAtual() - ic.getQuantidade());
            produtoRepository.save(produto);

            ItemPedido item = new ItemPedido();
            item.setProduto(produto);
            item.setQuantidade(ic.getQuantidade());
            item.setPrecoUnitarioNoMomento(produto.getPrecoAtual());
            return item;
        }).toList();

        BigDecimal totalProdutos = itensPedido.stream()
                .map(i -> i.getPrecoUnitarioNoMomento()
                        .multiply(BigDecimal.valueOf(i.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ── Monta entrega ─────────────────────────────────────────────────
        Entrega entrega = new Entrega();

        if (request.retiradaNaLoja()) {
            entrega.setRetiradaNaLoja(true);
            entrega.setStatusEntrega(StatusEntrega.RETIRADA_DISPONIVEL);
            entrega.setEnderecoEntrega("Retirada na loja");
            entrega.setValorFrete(BigDecimal.ZERO);
        } else {
            // Valida que coordenadas foram enviadas
            if (request.latitudeDestino() == null || request.longitudeDestino() == null)
                throw new RuntimeException("Coordenadas de entrega são obrigatórias.");

            if (!freteService.estaDentroDeSergiipe(
                    request.latitudeDestino(), request.longitudeDestino()))
                throw new RuntimeException(
                        "Entregas disponíveis apenas dentro do estado de Sergipe.");

            // Pega coordenadas da loja (origem — usa a loja do primeiro produto)
            Loja loja = itensCarrinho.get(0).getProduto().getLoja();
            double latOrigem = loja.getLatitudeLoja() != null ? loja.getLatitudeLoja() : -10.9167;
            double lonOrigem = loja.getLongitudeLoja() != null ? loja.getLongitudeLoja() : -37.0500;

            BigDecimal distancia = freteService.calcularDistanciaKm(
                    latOrigem, lonOrigem,
                    request.latitudeDestino(), request.longitudeDestino());

            BigDecimal pesoTotal = freteService.calcularPesoTotal(itensPedido);
            CategoriaCarga categoria = freteService.classificarCarga(pesoTotal);
            TipoVeiculo veiculo = freteService.definirVeiculo(categoria, distancia);
            boolean areaRemota = distancia.doubleValue() > 80;
            BigDecimal frete = freteService.calcularFrete(veiculo, distancia, areaRemota);

            // Associa entregador automaticamente
            Entregador entregador = null;
            try {
                entregador = entregadorService.encontrarMaisAdequado(
                        veiculo, latOrigem, lonOrigem);
                entregador.setDisponivel(false); // marca como ocupado
            } catch (RuntimeException ex) {
                // Se não há entregador, cria entrega pendente sem associação
            }

            entrega.setRetiradaNaLoja(false);
            entrega.setStatusEntrega(entregador != null
                    ? StatusEntrega.AGUARDANDO_ENTREGADOR
                    : StatusEntrega.PEDIDO_RECEBIDO);
            entrega.setEnderecoEntrega(request.enderecoEntrega());
            entrega.setCidadeDestino(request.cidadeDestino());
            entrega.setLatitudeDestino(request.latitudeDestino());
            entrega.setLongitudeDestino(request.longitudeDestino());
            entrega.setDistanciaKm(distancia);
            entrega.setValorFrete(frete);
            entrega.setTipoVeiculoNecessario(veiculo);
            entrega.setCategoriaCarga(categoria);
            entrega.setPesoTotalKg(pesoTotal);
            entrega.setEntregador(entregador);
        }

        // ── Pagamento ─────────────────────────────────────────────────────
        Pagamento pagamento = new Pagamento();
        pagamento.setMetodoPagamento(request.metodoPagamento());
        pagamento.setStatusPagamento(StatusPagamento.AGUARDANDO);

        // ── Total final (produtos + frete) ───────────────────────────────
        BigDecimal totalFinal = totalProdutos.add(
                entrega.getValorFrete() != null ? entrega.getValorFrete() : BigDecimal.ZERO);

        // ── Pedido ───────────────────────────────────────────────────────
        Pedido pedido = new Pedido();
        pedido.setComprador(usuario);
        pedido.setPagamento(pagamento);
        pedido.setEntrega(entrega);
        pedido.setValorTotal(totalFinal);
        pedido.setObservacoes(request.observacoes());
        itensPedido.forEach(i -> i.setPedido(pedido));
        pedido.setItens(itensPedido);

        Pedido salvo = pedidoRepository.save(pedido);
        carrinhoService.limpar(usuario);
        return salvo;
    }

    public Page<Pedido> listarMeusPedidos(Usuario usuario, Pageable pageable) {
        return pedidoRepository.findByCompradorId(usuario.getId(), pageable);
    }

    public Pedido buscarPorId(Long id, Usuario usuario) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        // Garante que só o dono vê o pedido
        if (!pedido.getComprador().getId().equals(usuario.getId()))
            throw new RuntimeException("Acesso negado.");

        return pedido;
    }

    public Page<Pedido> listarPedidosDaLoja(Usuario usuario, Pageable pageable) {
        return pedidoRepository.findByItens_Produto_Loja_UsuarioId(usuario.getId(), pageable);
    }

    @Transactional
    public Pedido atualizarStatusEntrega(Long pedidoId, StatusEntrega novoStatus, Usuario produtor) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        boolean pertenceAoProdutor = pedido.getItens().stream()
                .anyMatch(i -> i.getProduto().getLoja().getUsuario().getId().equals(produtor.getId()));

        if (!pertenceAoProdutor)
            throw new RuntimeException("Acesso negado.");

        pedido.getEntrega().setStatusEntrega(novoStatus);
        pedido.getEntrega().setDataAtualizacao(java.time.OffsetDateTime.now());
        return pedidoRepository.save(pedido);
    }
}