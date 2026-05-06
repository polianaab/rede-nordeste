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

    public PedidoService(PedidoRepository pedidoRepository,
            CarrinhoService carrinhoService,
            ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.carrinhoService = carrinhoService;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public Pedido checkout(CheckoutRequest request, Usuario usuario) {
        List<ItemCarrinho> itensCarrinho = carrinhoService.listarItensParaCheckout(usuario.getId());

        if (itensCarrinho.isEmpty())
            throw new RuntimeException("Seu carrinho está vazio.");

        if (!request.retiradaNaLoja() &&
                (request.enderecoEntrega() == null || request.enderecoEntrega().isBlank()))
            throw new RuntimeException("Endereço de entrega é obrigatório para entrega.");

        List<ItemPedido> itensPedido = itensCarrinho.stream().map(ic -> {
            Produto produto = ic.getProduto();

            if (produto.getEstoqueAtual() < ic.getQuantidade())
                throw new RuntimeException("Estoque insuficiente para: " + produto.getNome());

            produto.setEstoqueAtual(produto.getEstoqueAtual() - ic.getQuantidade());
            produtoRepository.save(produto);

            ItemPedido item = new ItemPedido();
            item.setProduto(produto);
            item.setQuantidade(ic.getQuantidade());
            item.setPrecoUnitarioNoMomento(produto.getPrecoAtual()); // preço travado no momento
            return item;
        }).toList();

        BigDecimal total = itensPedido.stream()
                .map(i -> i.getPrecoUnitarioNoMomento().multiply(BigDecimal.valueOf(i.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Pagamento pagamento = new Pagamento();
        pagamento.setMetodoPagamento(request.metodoPagamento());
        pagamento.setStatusPagamento(StatusPagamento.AGUARDANDO);

        Entrega entrega = new Entrega();
        entrega.setStatusEntrega(
                request.retiradaNaLoja() ? StatusEntrega.RETIRADA_DISPONIVEL : StatusEntrega.PENDENTE);
        entrega.setEnderecoEntrega(
                request.retiradaNaLoja() ? "Retirada na loja" : request.enderecoEntrega());

        Pedido pedido = new Pedido();
        pedido.setComprador(usuario);
        pedido.setPagamento(pagamento);
        pedido.setEntrega(entrega);
        pedido.setValorTotal(total);
        pedido.setObservacoes(request.observacoes());

        // Liga itens ao pedido
        itensPedido.forEach(i -> i.setPedido(pedido));
        pedido.setItens(itensPedido);

        Pedido salvo = pedidoRepository.save(pedido);

        // Limpa carrinho após pedido criado
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