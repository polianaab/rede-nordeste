package com.semeia_nordeste.backend.config;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.semeia_nordeste.backend.model.Cartao;
import com.semeia_nordeste.backend.model.Categoria;
import com.semeia_nordeste.backend.model.Chat;
import com.semeia_nordeste.backend.model.Endereco;
import com.semeia_nordeste.backend.model.Entrega;
import com.semeia_nordeste.backend.model.ItemPedido;
import com.semeia_nordeste.backend.model.Loja;
import com.semeia_nordeste.backend.model.Mensagem;
import com.semeia_nordeste.backend.model.Notificacao;
import com.semeia_nordeste.backend.model.Pagamento;
import com.semeia_nordeste.backend.model.Pedido;
import com.semeia_nordeste.backend.model.Produto;
import com.semeia_nordeste.backend.model.StatusEntrega;
import com.semeia_nordeste.backend.model.StatusPagamento;
import com.semeia_nordeste.backend.model.StatusProduto;
import com.semeia_nordeste.backend.model.TipoNotificacao;
import com.semeia_nordeste.backend.model.TipoPerfil;
import com.semeia_nordeste.backend.model.Usuario;
import com.semeia_nordeste.backend.repository.CartaoRepository;
import com.semeia_nordeste.backend.repository.CategoriaRepository;
import com.semeia_nordeste.backend.repository.ChatRepository;
import com.semeia_nordeste.backend.repository.EnderecoRepository;
import com.semeia_nordeste.backend.repository.LojaRepository;
import com.semeia_nordeste.backend.repository.MensagemRepository;
import com.semeia_nordeste.backend.repository.NotificacaoRepository;
import com.semeia_nordeste.backend.repository.PedidoRepository;
import com.semeia_nordeste.backend.repository.ProdutoRepository;
import com.semeia_nordeste.backend.repository.UsuarioRepository;

/**
 * Cria um MOCKUP completo de demonstração:
 *
 *   👨‍🌾 3 PRODUTORES com lojas verificadas (cidades diferentes em SE)
 *      • Fazenda Boa Esperança (Aracaju)
 *      • Sítio Mandacaru (Itabaiana)
 *      • Roça do Sertão (Tobias Barreto)
 *
 *   🛒 3 COMPRADORES (com endereços e cartões cadastrados)
 *      • Maria Comprador (Aracaju)
 *      • João Comprador (Lagarto)
 *      • Ana Comprador (Estância)
 *
 *   📦 9 PRODUTOS distribuídos nas categorias (Hortifruti, Grãos, Laticínios,
 *      Carnes, Bebidas, Artesanato)
 *
 *   📋 3 PEDIDOS já realizados (compradores comprando dos vendedores) —
 *      em estágios diferentes (entregue, a caminho, preparando)
 *
 *   🔔 NOTIFICAÇÕES para todos os perfis
 *
 *   📍 ENDEREÇOS de entrega para cada comprador
 *   💳 1 CARTÃO mock para cada comprador (PCI-aware: só finais)
 *
 * Habilite com DEMO_SEED=true no .env. Idempotente.
 *
 * Senha de todos os usuários demo: DEMO_SENHA (default Demo@2026).
 *
 * Roda DEPOIS do AdminSeeder graças ao @Order(10).
 */
@Component
@Order(10)
public class DemoSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoSeeder.class);

    private final UsuarioRepository usuarioRepository;
    private final LojaRepository lojaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;
    private final PedidoRepository pedidoRepository;
    private final EnderecoRepository enderecoRepository;
    private final CartaoRepository cartaoRepository;
    private final NotificacaoRepository notificacaoRepository;
    private final ChatRepository chatRepository;
    private final MensagemRepository mensagemRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${DEMO_SEED:false}")
    private boolean habilitado;

    @Value("${DEMO_SENHA:Demo@2026}")
    private String demoSenha;

    public DemoSeeder(UsuarioRepository usuarioRepository,
            LojaRepository lojaRepository,
            CategoriaRepository categoriaRepository,
            ProdutoRepository produtoRepository,
            PedidoRepository pedidoRepository,
            EnderecoRepository enderecoRepository,
            CartaoRepository cartaoRepository,
            NotificacaoRepository notificacaoRepository,
            ChatRepository chatRepository,
            MensagemRepository mensagemRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.lojaRepository = lojaRepository;
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
        this.pedidoRepository = pedidoRepository;
        this.enderecoRepository = enderecoRepository;
        this.cartaoRepository = cartaoRepository;
        this.notificacaoRepository = notificacaoRepository;
        this.chatRepository = chatRepository;
        this.mensagemRepository = mensagemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!habilitado) {
            log.info("[DemoSeeder] desabilitado (DEMO_SEED=false). Pulando.");
            return;
        }

        // Importante: NÃO usar @Transactional no run() — se uma etapa falhar
        // (ex: tabela nova ainda não migrada), o ROLLBACK derruba TUDO,
        // incluindo usuários/lojas/produtos que já foram criados com sucesso.
        // Cada etapa abaixo é isolada via try/catch para falhar localmente.

        try { rodarSeed(); }
        catch (Exception e) {
            log.error("[DemoSeeder] FALHOU mas continuando — outros seeds podem ter funcionado. Causa: {}", e.getMessage());
        }
    }

    private void rodarSeed() {
        // ── PRODUTORES ───────────────────────────────────────────────
        Usuario produtor1 = criarOuObterUsuario(
                "demo.produtor@redenordeste.com",
                "Maria Boa Esperança",
                "11111111111", "79911111111",
                TipoPerfil.PRODUTOR,
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200");

        Usuario produtor2 = criarOuObterUsuario(
                "demo.produtor2@redenordeste.com",
                "José Mandacaru",
                "22233344455", "79922222200",
                TipoPerfil.PRODUTOR,
                "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200");

        Usuario produtor3 = criarOuObterUsuario(
                "demo.produtor3@redenordeste.com",
                "Ana do Sertão",
                "33344455566", "79933333300",
                TipoPerfil.PRODUTOR,
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200");

        // ── COMPRADORES ──────────────────────────────────────────────
        Usuario comprador1 = criarOuObterUsuario(
                "demo.comprador@redenordeste.com",
                "Maria Silva",
                "44455566677", "79944444400",
                TipoPerfil.COMPRADOR,
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200");

        Usuario comprador2 = criarOuObterUsuario(
                "demo.comprador2@redenordeste.com",
                "João Pereira",
                "55566677788", "79955555500",
                TipoPerfil.COMPRADOR,
                "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200");

        Usuario comprador3 = criarOuObterUsuario(
                "demo.comprador3@redenordeste.com",
                "Ana Lima",
                "66677788899", "79966666600",
                TipoPerfil.COMPRADOR,
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200");

        // ── LOJAS (uma por produtor) ─────────────────────────────────
        Loja loja1 = criarOuObterLoja(produtor1,
                "Fazenda Boa Esperança",
                "Produção familiar de hortaliças e raízes no interior de Sergipe.",
                "Aracaju", -10.9167, -37.0500);

        Loja loja2 = criarOuObterLoja(produtor2,
                "Sítio Mandacaru",
                "Grãos, farinhas e derivados de mandioca direto do agreste.",
                "Itabaiana", -10.6850, -37.4280);

        Loja loja3 = criarOuObterLoja(produtor3,
                "Roça do Sertão",
                "Carnes secas, queijos e laticínios artesanais do alto sertão.",
                "Tobias Barreto", -11.1830, -38.0080);

        // ── PRODUTOS ─────────────────────────────────────────────────
        try { criarProdutosMockup(loja1, loja2, loja3); }
        catch (Exception e) { log.error("[DemoSeeder] falha em produtos: {}", e.getMessage()); }

        // ── ENDEREÇOS dos compradores ────────────────────────────────
        try {
            criarEndereco(comprador1, "Maria Silva", "(79) 99888-7766",
                    "49000-000", "Sergipe - Aracaju", "Atalaia", "Rua das Palmeiras", "450",
                    "Apto 102", -10.9850, -37.0490, true);
            criarEndereco(comprador2, "João Pereira", "(79) 99777-6655",
                    "49400-000", "Sergipe - Lagarto", "Centro", "Rua Boa Vista", "78",
                    null, -10.9170, -37.6680, true);
            criarEndereco(comprador3, "Ana Lima", "(79) 99666-5544",
                    "49200-000", "Sergipe - Estância", "São Francisco", "Av. Beira Mar", "1020",
                    "Casa 2", -11.2680, -37.4380, true);
        } catch (Exception e) { log.error("[DemoSeeder] falha em endereços: {}", e.getMessage()); }

        // ── CARTÕES (PCI-aware: só finais) ───────────────────────────
        try {
            criarCartao(comprador1, "MARIA SILVA", "4321", "Visa", "12/28");
            criarCartao(comprador2, "JOAO PEREIRA", "5678", "Mastercard", "06/27");
            criarCartao(comprador3, "ANA LIMA", "9012", "Elo", "09/29");
        } catch (Exception e) { log.error("[DemoSeeder] falha em cartões: {}", e.getMessage()); }

        // ── PEDIDOS (cross-perfil — compradores compram dos produtores) ──
        try {
            criarPedidoMockup(comprador1, loja1, StatusEntrega.ENTREGUE);
            criarPedidoMockup(comprador2, loja2, StatusEntrega.SAIU_PARA_ENTREGA);
            criarPedidoMockup(comprador3, loja3, StatusEntrega.PEDIDO_RECEBIDO);
        } catch (Exception e) { log.error("[DemoSeeder] falha em pedidos: {}", e.getMessage()); }

        // ── NOTIFICAÇÕES (para cada perfil) ──────────────────────────
        try { criarNotificacoesMockup(produtor1, comprador1, comprador2, comprador3); }
        catch (Exception e) { log.error("[DemoSeeder] falha em notificações: {}", e.getMessage()); }

        // ── CHATS mockados (comprador ↔ vendedor) ────────────────────
        try { criarChatsMockup(comprador1, loja1, comprador2, loja2); }
        catch (Exception e) { log.error("[DemoSeeder] falha em chats: {}", e.getMessage()); }

        log.info("[DemoSeeder] MOCKUP completo criado. Senha de todos os demos: {}", demoSenha);
        log.info("[DemoSeeder]   Produtores: demo.produtor@, demo.produtor2@, demo.produtor3@");
        log.info("[DemoSeeder]   Compradores: demo.comprador@, demo.comprador2@, demo.comprador3@");
    }

    // ── HELPERS ──────────────────────────────────────────────────────

    @Transactional
    public Usuario criarOuObterUsuario(String email, String nome, String cpf, String tel,
                                         TipoPerfil perfil, String fotoUrl) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(email);
        if (existente.isPresent()) {
            log.info("[DemoSeeder] {} já existe — mantendo.", email);
            return existente.get();
        }
        Usuario u = new Usuario();
        u.setEmail(email);
        u.setNomeCompleto(nome);
        u.setCpfCnpj(cpf);
        u.setTelefone(tel);
        u.setTipoPerfil(perfil);
        u.setSenhaHash(passwordEncoder.encode(demoSenha));
        u.setContaAtiva(true);
        u.setFotoPerfilUrl(fotoUrl);
        Usuario salvo = usuarioRepository.save(u);
        log.info("[DemoSeeder] {} criado ({}).", email, perfil);
        return salvo;
    }

    @Transactional
    public Loja criarOuObterLoja(Usuario produtor, String nomeLoja, String bio,
                                    String cidade, double lat, double lon) {
        Optional<Loja> existente = lojaRepository.findByUsuarioId(produtor.getId());
        if (existente.isPresent()) return existente.get();

        Loja loja = new Loja();
        loja.setUsuario(produtor);
        loja.setNomeLoja(nomeLoja);
        loja.setDescricaoBio(bio);
        loja.setCidade(cidade);
        loja.setEstado("SE");
        loja.setAceitaRetirada(true);
        loja.setFazEntrega(true);
        loja.setValorMinimoPedido(BigDecimal.valueOf(20));
        loja.setTaxaEntregaFixa(BigDecimal.ZERO);
        loja.setLatitudeLoja(lat);
        loja.setLongitudeLoja(lon);
        loja.setVerificada(true);
        loja.setSuspensa(false);
        loja.setDataVerificacao(OffsetDateTime.now());
        Loja salva = lojaRepository.save(loja);
        log.info("[DemoSeeder] loja '{}' criada e verificada ({}).", salva.getNomeLoja(), cidade);
        return salva;
    }

    @Transactional
    public void criarProdutosMockup(Loja loja1, Loja loja2, Loja loja3) {
        Categoria hortifruti = buscarCategoria("Hortifruti");
        Categoria graos = buscarCategoria("Grãos");
        Categoria laticinios = buscarCategoria("Laticínios");
        Categoria carnes = buscarCategoria("Carnes");
        Categoria bebidas = buscarCategoria("Bebidas");
        Categoria artesanato = buscarCategoria("Artesanato");

        // Defensivo: se alguma das essenciais falta, o CategoriaSeeder deveria ter
        // criado. Se chegamos aqui sem categorias, há um bug no CategoriaSeeder
        // ou alguém apagou as categorias direto no banco.
        if (hortifruti == null || graos == null || laticinios == null) {
            log.error("[DemoSeeder] categorias essenciais não encontradas! Hortifruti={}, Grãos={}, Laticínios={}",
                    hortifruti != null, graos != null, laticinios != null);
            log.error("[DemoSeeder] verifique o CategoriaSeeder e o estado da tabela 'categorias'.");
            return;
        }
        log.info("[DemoSeeder] categorias OK — criando produtos demo...");

        List<Produto> aCriar = new ArrayList<>();

        // ── Loja 1: Fazenda Boa Esperança (hortifruti + bebidas) ─────
        if (semProdutos(loja1)) {
            aCriar.add(produto(loja1, hortifruti, "Laranja Pera (Cento)",
                    "Laranjas doces colhidas no dia. Ideal para sucos naturais.",
                    BigDecimal.valueOf(25.00), "Cento", 50, BigDecimal.valueOf(8.0),
                    "https://img.freepik.com/fotos-gratis/laranjas-frescas-em-uma-cesta_23-2148288594.jpg"));
            aCriar.add(produto(loja1, hortifruti, "Tomate Cereja Orgânico",
                    "Tomates cereja frescos, cultivados sem agrotóxicos.",
                    BigDecimal.valueOf(8.90), "Bandeja 300g", 80, BigDecimal.valueOf(0.3),
                    "https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/beirario/media/uploads/produtos/foto/b3fd841dfd2c3file.png"));
            aCriar.add(produto(loja1, bebidas, "Suco de Maracujá (1L)",
                    "Polpa natural extraída no dia, sem conservantes.",
                    BigDecimal.valueOf(14.00), "Garrafa 1L", 30, BigDecimal.valueOf(1.0),
                    "https://images.unsplash.com/photo-1546173159-315724a31696?w=600"));
        }

        // ── Loja 2: Sítio Mandacaru (grãos) ──────────────────────────
        if (semProdutos(loja2)) {
            aCriar.add(produto(loja2, graos, "Farinha de Mandioca Fina",
                    "Farinha artesanal torrada em forno de lenha.",
                    BigDecimal.valueOf(8.50), "kg", 100, BigDecimal.valueOf(1.0),
                    "https://images.tcdn.com.br/img/editor/up/694503/farinha.jpg"));
            aCriar.add(produto(loja2, graos, "Feijão Verde Nordestino",
                    "Feijão verde fresco, colhido na manhã do envio.",
                    BigDecimal.valueOf(15.00), "kg", 60, BigDecimal.valueOf(1.0),
                    "https://receitadaboa.com.br/wp-content/uploads/2024/09/Feijao-verde-nordestino.jpg"));
            aCriar.add(produto(loja2, graos, "Tapioca em Goma (500g)",
                    "Goma de tapioca hidratada, pronta para a chapa.",
                    BigDecimal.valueOf(6.50), "Pacote 500g", 120, BigDecimal.valueOf(0.5),
                    "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=600"));
        }

        // ── Loja 3: Roça do Sertão (carnes + laticínios + artesanato) ──
        if (semProdutos(loja3)) {
            aCriar.add(produto(loja3, laticinios, "Queijo Coalho Tradicional",
                    "Queijo coalho artesanal, ideal para o churrasco.",
                    BigDecimal.valueOf(38.00), "kg", 25, BigDecimal.valueOf(1.0),
                    "https://api.ootimista.com.br/wp-content/uploads/2023/02/queijo-coalho-embrapa.jpg"));
            aCriar.add(produto(loja3, carnes != null ? carnes : laticinios, "Carne de Sol (500g)",
                    "Carne de sol curada por 7 dias, sabor inconfundível.",
                    BigDecimal.valueOf(38.00), "Pacote 500g", 18, BigDecimal.valueOf(0.5),
                    "https://revistamaiscarne.com.br/wp-content/uploads/2024/05/Brasileirissima-a-Carne-Seca-segue-conquistando-novos-publicos-2.jpg"));
            aCriar.add(produto(loja3, artesanato != null ? artesanato : laticinios, "Cesto de Palha Trançado",
                    "Cesto artesanal feito por bordadeiras do sertão.",
                    BigDecimal.valueOf(120.00), "Unidade", 10, BigDecimal.valueOf(0.6),
                    "https://img.elo7.com.br/product/zoom/3996150/cesto-de-palha-com-alca-40cm-cesto-de-palha.jpg"));
        }

        if (!aCriar.isEmpty()) {
            produtoRepository.saveAll(aCriar);
            log.info("[DemoSeeder] {} produtos demo criados.", aCriar.size());
        } else {
            log.info("[DemoSeeder] produtos demo já existem — pulando.");
        }
    }

    private Categoria buscarCategoria(String nome) {
        return categoriaRepository.findAll().stream()
                .filter(c -> nome.equalsIgnoreCase(c.getNome()))
                .findFirst().orElse(null);
    }

    private boolean semProdutos(Loja loja) {
        return produtoRepository
                .findByLojaId(loja.getId(), org.springframework.data.domain.PageRequest.of(0, 1))
                .isEmpty();
    }

    private Produto produto(Loja loja, Categoria cat, String nome, String desc,
                            BigDecimal preco, String unidade, int estoque,
                            BigDecimal pesoKg, String imagem) {
        Produto p = new Produto();
        p.setLoja(loja);
        p.setCategoria(cat);
        p.setNome(nome);
        p.setDescricao(desc);
        p.setPrecoAtual(preco);
        p.setUnidadeMedida(unidade);
        p.setEstoqueAtual(estoque);
        p.setPesoKg(pesoKg);
        p.setImagemUrl(imagem);
        p.setStatus(StatusProduto.APROVADO);
        return p;
    }

    private void criarEndereco(Usuario usuario, String destinatario, String tel,
                                String cep, String estadoCidade, String bairro,
                                String rua, String numero, String complemento,
                                Double lat, Double lon, boolean principal) {
        if (enderecoRepository.countByUsuarioId(usuario.getId()) > 0) return;
        Endereco e = new Endereco();
        e.setUsuario(usuario);
        e.setDestinatario(destinatario);
        e.setTelefone(tel);
        e.setCep(cep);
        e.setEstadoCidade(estadoCidade);
        e.setBairro(bairro);
        e.setRua(rua);
        e.setNumero(numero);
        e.setComplemento(complemento);
        e.setLatitudeDestino(lat);
        e.setLongitudeDestino(lon);
        e.setPrincipal(principal);
        enderecoRepository.save(e);
        log.info("[DemoSeeder] endereço criado para {}", usuario.getEmail());
    }

    private void criarCartao(Usuario usuario, String titular, String final4,
                              String bandeira, String validade) {
        if (!cartaoRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuario.getId()).isEmpty()) return;
        Cartao c = new Cartao();
        c.setUsuario(usuario);
        c.setTitular(titular);
        c.setFinalCartao(final4);
        c.setBandeira(bandeira);
        c.setValidade(validade);
        cartaoRepository.save(c);
    }

    /**
     * Cria um pedido mock para o comprador na loja informada — usa 1 produto
     * aleatório da loja, quantidade 2, pagamento aprovado.
     */
    private void criarPedidoMockup(Usuario comprador, Loja loja, StatusEntrega statusEntrega) {
        // Se já existe pedido deste comprador, pula (idempotente).
        if (!pedidoRepository.findByCompradorId(comprador.getId(),
                org.springframework.data.domain.PageRequest.of(0, 1)).isEmpty()) return;

        var produtos = produtoRepository.findByLojaId(loja.getId(),
                org.springframework.data.domain.PageRequest.of(0, 1)).getContent();
        if (produtos.isEmpty()) return;

        Produto produto = produtos.get(0);
        int quantidade = 2;

        ItemPedido item = new ItemPedido();
        item.setProduto(produto);
        item.setQuantidade(quantidade);
        item.setPrecoUnitarioNoMomento(produto.getPrecoAtual());

        BigDecimal total = produto.getPrecoAtual().multiply(BigDecimal.valueOf(quantidade));

        Entrega entrega = new Entrega();
        entrega.setStatusEntrega(statusEntrega);
        entrega.setEnderecoEntrega("Rua das Palmeiras, 450 - Atalaia, Aracaju/SE");
        entrega.setCidadeDestino("Aracaju");
        entrega.setLatitudeDestino(-10.9850);
        entrega.setLongitudeDestino(-37.0490);
        entrega.setRetiradaNaLoja(false);
        entrega.setValorFrete(BigDecimal.valueOf(10.00));
        if (statusEntrega == StatusEntrega.ENTREGUE) {
            entrega.setDataEntregue(OffsetDateTime.now().minusDays(3));
        }

        Pagamento pagamento = new Pagamento();
        pagamento.setMetodoPagamento("CARTAO");
        pagamento.setStatusPagamento(StatusPagamento.APROVADO);
        pagamento.setDataPagamento(OffsetDateTime.now().minusDays(3));

        Pedido pedido = new Pedido();
        pedido.setComprador(comprador);
        pedido.setEntrega(entrega);
        pedido.setPagamento(pagamento);
        pedido.setValorTotal(total.add(BigDecimal.valueOf(10.00)));
        item.setPedido(pedido);
        pedido.setItens(List.of(item));

        pedidoRepository.save(pedido);
        log.info("[DemoSeeder] pedido criado: {} comprou de {} (status: {})",
                comprador.getEmail(), loja.getNomeLoja(), statusEntrega);
    }

    private void criarNotificacoesMockup(Usuario produtor1, Usuario comprador1,
                                         Usuario comprador2, Usuario comprador3) {
        // Comprador 1 — recebe notificações de pedido
        notificarSeVazio(comprador1, TipoNotificacao.PEDIDO, "Seu pedido foi entregue",
                "O pedido da Fazenda Boa Esperança chegou no seu endereço. Avalie!", "/perfil");
        notificarSeVazio(comprador1, TipoNotificacao.PROMOCAO, "Promoção do dia",
                "Tomate Cereja Orgânico com 20% de desconto na Fazenda Boa Esperança.", "/home2");
        notificarSeVazio(comprador1, TipoNotificacao.SISTEMA, "Bem-vindo(a) à Rede Nordeste",
                "Explore produtos diretamente de pequenos produtores locais.", null);

        // Comprador 2 — pedido a caminho
        notificarSeVazio(comprador2, TipoNotificacao.PEDIDO, "Seu pedido está a caminho",
                "Saiu para entrega! Previsão: 2 dias úteis.", "/perfil");
        notificarSeVazio(comprador2, TipoNotificacao.PROMOCAO, "Novo produto disponível",
                "Tapioca em Goma chegou no Sítio Mandacaru.", "/home2");

        // Comprador 3 — pedido recém-recebido
        notificarSeVazio(comprador3, TipoNotificacao.PEDIDO, "Pedido confirmado",
                "Recebemos seu pedido na Roça do Sertão. Em preparação.", "/perfil");

        // Produtor 1 — recebe notificação de venda
        notificarSeVazio(produtor1, TipoNotificacao.PEDIDO, "Você fez uma venda!",
                "Maria Silva comprou da sua loja. Confira o painel.", "/painelvendedor");
        notificarSeVazio(produtor1, TipoNotificacao.LOJA, "Loja verificada",
                "Sua loja foi aprovada pelo admin e já está visível na vitrine.", null);
    }

    /**
     * Cria 2 conversas demo entre comprador e produtor com algumas mensagens,
     * para que a tela de chat não apareça vazia no primeiro login.
     */
    private void criarChatsMockup(Usuario comprador1, Loja loja1,
                                   Usuario comprador2, Loja loja2) {
        criarChatComMensagens(comprador1, loja1, new String[][] {
            { "comprador", "Oi! As laranjas estão bem doces?" },
            { "produtor", "Olá, Maria! Sim, colhidas hoje cedo. Posso separar 1 cento para você?" },
            { "comprador", "Pode sim! Entrega chega aqui em Atalaia?" },
            { "produtor", "Chega sim, frete grátis acima de R$ 50." },
        });

        criarChatComMensagens(comprador2, loja2, new String[][] {
            { "comprador", "Boa tarde, a tapioca em goma é fresca?" },
            { "produtor", "Boa tarde! É feita 2x por semana, ainda dá tempo de incluir no lote de quinta." },
        });
    }

    private void criarChatComMensagens(Usuario comprador, Loja loja, String[][] mensagens) {
        // Idempotente — se o chat já existe, pula.
        if (chatRepository.findByCompradorIdAndLojaId(comprador.getId(), loja.getId()).isPresent()) return;

        Chat chat = new Chat();
        chat.setComprador(comprador);
        chat.setLoja(loja);
        chat.setDataInicio(OffsetDateTime.now().minusDays(2));
        chat = chatRepository.save(chat);

        Usuario produtor = loja.getUsuario();
        OffsetDateTime base = OffsetDateTime.now().minusHours(mensagens.length);

        for (int i = 0; i < mensagens.length; i++) {
            String[] m = mensagens[i];
            Usuario remetente = "comprador".equals(m[0]) ? comprador : produtor;
            Mensagem msg = new Mensagem();
            msg.setChat(chat);
            msg.setRemetente(remetente);
            msg.setConteudo(m[1]);
            msg.setDataEnvio(base.plusMinutes(i * 7L));
            // Última mensagem fica como NÃO LIDA para mostrar badge.
            msg.setLida(i < mensagens.length - 1);
            mensagemRepository.save(msg);
        }

        log.info("[DemoSeeder] chat demo criado entre {} e {} ({} mensagens).",
                comprador.getEmail(), loja.getNomeLoja(), mensagens.length);
    }

    private void notificarSeVazio(Usuario u, TipoNotificacao tipo, String titulo,
                                   String mensagem, String linkAcao) {
        if (notificacaoRepository.findByUsuarioIdOrderByDataCriacaoDesc(u.getId()).size() >= 3) return;
        Notificacao n = new Notificacao();
        n.setUsuario(u);
        n.setTipo(tipo);
        n.setTitulo(titulo);
        n.setMensagem(mensagem);
        n.setLinkAcao(linkAcao);
        notificacaoRepository.save(n);
    }
}
