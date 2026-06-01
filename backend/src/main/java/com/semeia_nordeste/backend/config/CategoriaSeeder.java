package com.semeia_nordeste.backend.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.semeia_nordeste.backend.model.Categoria;
import com.semeia_nordeste.backend.repository.CategoriaRepository;

/**
 * Garante que as 10 categorias-base existem no banco no startup.
 *
 * Why duplicar do 02_seed.sql: o DemoSeeder.java busca categorias por NOME
 * literal — se alguém renomear "Grãos" para "Cereais" no SQL e esquecer de
 * atualizar o Java, os produtos demo NÃO são criados e o erro é silencioso
 * (apenas um warn nos logs). Centralizar a fonte da verdade no Java elimina
 * essa armadilha — o SQL continua válido como referência didática.
 *
 * Idempotente: usa findByNome antes de criar.
 *
 * Roda ANTES do DemoSeeder (@Order < 10) e DEPOIS do AdminSeeder
 * (@Order default = LOWEST_PRECEDENCE).
 */
@Component
@Order(5)
public class CategoriaSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CategoriaSeeder.class);

    private final CategoriaRepository repository;

    /**
     * Lista canônica de categorias da plataforma.
     * Mudou um nome aqui? Compile e suba — o seed corrige.
     */
    public static final List<CategoriaPadrao> PADRAO = List.of(
            new CategoriaPadrao("Hortifruti", "Frutas, legumes e verduras frescas",
                    "https://cdn-icons-png.flaticon.com/512/2329/2329903.png"),
            new CategoriaPadrao("Laticínios", "Queijos, leite e coalhadas direto do produtor",
                    "https://cdn-icons-png.flaticon.com/512/2674/2674486.png"),
            new CategoriaPadrao("Grãos", "Feijão, milho, arroz e farinhas",
                    "https://cdn-icons-png.flaticon.com/512/1147/1147560.png"),
            new CategoriaPadrao("Carnes", "Carnes frescas e processadas",
                    "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"),
            new CategoriaPadrao("Colheita", "Produtos colhidos no dia",
                    "https://cdn-icons-png.flaticon.com/512/2909/2909769.png"),
            new CategoriaPadrao("Artesanato", "Produtos feitos à mão por artesãos locais",
                    "https://cdn-icons-png.flaticon.com/512/3081/3081918.png"),
            new CategoriaPadrao("Gastronomia", "Pratos prontos e conservas",
                    "https://cdn-icons-png.flaticon.com/512/3081/3081887.png"),
            new CategoriaPadrao("Cama Mesa e Banho", "Tecidos, toalhas e roupa de cama",
                    "https://cdn-icons-png.flaticon.com/512/2917/2917990.png"),
            new CategoriaPadrao("Têxtil", "Roupas, bordados e tecelagens",
                    "https://cdn-icons-png.flaticon.com/512/3637/3637758.png"),
            new CategoriaPadrao("Bebidas", "Sucos, polpas e licores artesanais",
                    "https://cdn-icons-png.flaticon.com/512/1719/1719923.png"));

    public CategoriaSeeder(CategoriaRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        int criadas = 0;
        for (CategoriaPadrao p : PADRAO) {
            boolean jaExiste = repository.findAll().stream()
                    .anyMatch(c -> p.nome().equalsIgnoreCase(c.getNome()));
            if (jaExiste) continue;

            Categoria c = new Categoria();
            c.setNome(p.nome());
            c.setDescricao(p.descricao());
            c.setImagemIconeUrl(p.iconeUrl());
            repository.save(c);
            criadas++;
        }
        if (criadas > 0) {
            log.info("[CategoriaSeeder] {} categoria(s) criada(s).", criadas);
        } else {
            log.info("[CategoriaSeeder] todas as 10 categorias-base já existiam.");
        }
    }

    public record CategoriaPadrao(String nome, String descricao, String iconeUrl) {}
}
