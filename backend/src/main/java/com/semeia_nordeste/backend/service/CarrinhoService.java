package com.semeia_nordeste.backend.service;

import com.semeia_nordeste.backend.dto.*;
import com.semeia_nordeste.backend.model.*;
import com.semeia_nordeste.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CarrinhoService {

    private final ItemCarrinhoRepository carrinhoRepository;
    private final ProdutoRepository produtoRepository;

    public CarrinhoService(ItemCarrinhoRepository carrinhoRepository,
            ProdutoRepository produtoRepository) {
        this.carrinhoRepository = carrinhoRepository;
        this.produtoRepository = produtoRepository;
    }

    public CarrinhoResponse listar(Usuario usuario) {
        List<ItemCarrinho> itens = carrinhoRepository.findByUsuarioId(usuario.getId());
        List<CarrinhoItemResponse> response = itens.stream()
                .map(CarrinhoItemResponse::fromEntity)
                .toList();

        BigDecimal total = response.stream()
                .map(CarrinhoItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CarrinhoResponse(response, response.size(), total);
    }

    @Transactional
    public CarrinhoResponse adicionar(CarrinhoItemRequest request, Usuario usuario) {
        Produto produto = produtoRepository.findById(request.produtoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        if (produto.getEstoqueAtual() < request.quantidade())
            throw new RuntimeException("Estoque insuficiente. Disponível: " + produto.getEstoqueAtual());

        ItemCarrinho item = carrinhoRepository
                .findByUsuarioIdAndProdutoId(usuario.getId(), produto.getId())
                .orElse(new ItemCarrinho());

        item.setUsuario(usuario);
        item.setProduto(produto);
        item.setQuantidade(request.quantidade());
        carrinhoRepository.save(item);

        return listar(usuario);
    }

    @Transactional
    public CarrinhoResponse remover(Long produtoId, Usuario usuario) {
        carrinhoRepository.deleteByUsuarioIdAndProdutoId(usuario.getId(), produtoId);
        return listar(usuario);
    }

    @Transactional
    public void limpar(Usuario usuario) {
        carrinhoRepository.deleteByUsuarioId(usuario.getId());
    }

    public List<ItemCarrinho> listarItensParaCheckout(Long usuarioId) {
        return carrinhoRepository.findByUsuarioId(usuarioId);
    }
}