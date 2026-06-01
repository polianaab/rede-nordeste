-- ============================================================
-- Rede Nordeste — Schema completo do banco (PostgreSQL)
-- ============================================================
-- Como usar localmente:
--   1) Crie um banco vazio:        CREATE DATABASE rede_nordeste;
--   2) Conecte nesse banco:        \c rede_nordeste
--   3) Rode este arquivo:          \i 01_schema.sql
--   4) Rode o seed didático:       \i 02_seed.sql
--   5) Suba o backend (Spring Boot) — o AdminSeeder cria o usuário ADMIN.
--   6) Se DEMO_SEED=true no .env, o DemoSeeder cria um produtor + comprador
--      + loja + produtos de exemplo na primeira execução.
--
-- Este arquivo é idempotente — pode rodar várias vezes sem erro.
-- ============================================================


-- ============================================================
-- 1) USUÁRIOS
-- ------------------------------------------------------------
-- Núcleo de autenticação. Cada usuário tem UM perfil:
--   COMPRADOR  → consumidor final
--   PRODUTOR   → dono de loja (pode cadastrar produtos)
--   ADMIN      → gerencia tudo pelo painel
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id                 BIGSERIAL PRIMARY KEY,
    nome_completo      VARCHAR(150) NOT NULL,
    cpf_cnpj           VARCHAR(18)  NOT NULL UNIQUE,
    telefone           VARCHAR(15)  NOT NULL UNIQUE,
    email              VARCHAR(100) NOT NULL UNIQUE,
    senha_hash         TEXT         NOT NULL,             -- BCrypt cost 10
    tipo_perfil        VARCHAR(20)  NOT NULL
                       CHECK (tipo_perfil IN ('PRODUTOR', 'COMPRADOR', 'ADMIN')),
    foto_perfil_url    TEXT,
    conta_ativa        BOOLEAN      NOT NULL DEFAULT TRUE,
    data_criacao       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    data_ultimo_login  TIMESTAMPTZ,
    motivo_suspensao   TEXT
);


-- ============================================================
-- 2) SESSÕES (refresh tokens persistidos)
-- ------------------------------------------------------------
-- Cada login cria UMA sessão. O refresh token fica aqui para podermos
-- revogá-lo (logout, admin suspendendo conta, troca de senha).
-- Quando o usuário pede um access novo, rotacionamos:
--   revoga a sessão atual + cria uma nova com refresh diferente.
-- ============================================================
CREATE TABLE IF NOT EXISTS sessoes (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      BIGINT      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    refresh_token   TEXT        NOT NULL UNIQUE,
    user_agent      TEXT,
    ip              VARCHAR(45),
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expira_em       TIMESTAMPTZ NOT NULL,
    revogado_em     TIMESTAMPTZ,
    ultimo_uso_em   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes (usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_token   ON sessoes (refresh_token) WHERE revogado_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessoes_ativas  ON sessoes (usuario_id, revogado_em) WHERE revogado_em IS NULL;


-- ============================================================
-- 3) CATEGORIAS (de produtos)
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
    id                 BIGSERIAL PRIMARY KEY,
    nome               VARCHAR(50) NOT NULL UNIQUE,
    descricao          TEXT,
    imagem_icone_url   TEXT
);


-- ============================================================
-- 4) LOJAS (uma por produtor)
-- ------------------------------------------------------------
-- verificada = TRUE → produtos da loja podem aparecer na vitrine pública.
-- suspensa   = TRUE → loja escondida (penalidade pelo admin).
-- ============================================================
CREATE TABLE IF NOT EXISTS lojas (
    id                   BIGSERIAL PRIMARY KEY,
    usuario_id           BIGINT UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_loja            VARCHAR(100) NOT NULL,
    descricao_bio        TEXT,
    logradouro           VARCHAR(255),
    bairro               VARCHAR(100),
    cidade               VARCHAR(100),
    estado               VARCHAR(2)   DEFAULT 'SE',
    cep                  VARCHAR(8),
    aceita_retirada      BOOLEAN      DEFAULT TRUE,
    faz_entrega          BOOLEAN      DEFAULT FALSE,
    valor_minimo_pedido  NUMERIC(10,2) DEFAULT 0.00,
    taxa_entrega_fixa    NUMERIC(10,2) DEFAULT 0.00,
    logo_url             TEXT,
    latitude_loja        DOUBLE PRECISION,
    longitude_loja       DOUBLE PRECISION,
    data_abertura        TIMESTAMPTZ  DEFAULT NOW(),
    verificada           BOOLEAN      NOT NULL DEFAULT FALSE,
    suspensa             BOOLEAN      NOT NULL DEFAULT FALSE,
    data_verificacao     TIMESTAMPTZ,
    motivo_suspensao     TEXT
);

CREATE INDEX IF NOT EXISTS idx_lojas_verificada ON lojas (verificada, suspensa);


-- ============================================================
-- 5) PRODUTOS
-- ------------------------------------------------------------
-- status:
--   APROVADO  → visível na vitrine (default — destrava o fluxo).
--   PENDENTE  → cadastrado mas escondido (não usamos por padrão).
--   REJEITADO → rejeitado pelo admin (escondido).
-- ============================================================
CREATE TABLE IF NOT EXISTS produtos (
    id              BIGSERIAL PRIMARY KEY,
    loja_id         BIGINT REFERENCES lojas(id) ON DELETE CASCADE,
    categoria_id    BIGINT REFERENCES categorias(id),
    nome            VARCHAR(100)  NOT NULL,
    descricao       TEXT,
    preco_atual     NUMERIC(10,2) NOT NULL,
    unidade_medida  VARCHAR(20)   NOT NULL,
    estoque_atual   INTEGER       DEFAULT 0,
    peso_kg         NUMERIC(8,2)  DEFAULT 0.5,
    imagem_url      TEXT,
    data_cadastro   TIMESTAMPTZ   DEFAULT NOW(),
    status          VARCHAR(20)   NOT NULL DEFAULT 'APROVADO'
                    CHECK (status IN ('PENDENTE', 'APROVADO', 'REJEITADO'))
);

CREATE INDEX IF NOT EXISTS idx_produtos_loja        ON produtos (loja_id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria   ON produtos (categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_status_data ON produtos (status, data_cadastro DESC);


-- ============================================================
-- 6) CARRINHO (do comprador, antes do checkout)
-- ============================================================
CREATE TABLE IF NOT EXISTS item_carrinho (
    id           BIGSERIAL PRIMARY KEY,
    usuario_id   BIGINT REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id   BIGINT REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade   INTEGER NOT NULL CHECK (quantidade > 0),
    data_adicao  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(usuario_id, produto_id)
);

CREATE INDEX IF NOT EXISTS idx_carrinho_usuario ON item_carrinho (usuario_id);


-- ============================================================
-- 7) PAGAMENTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS pagamentos (
    id                BIGSERIAL PRIMARY KEY,
    metodo_pagamento  VARCHAR(50) NOT NULL,
    status_pagamento  VARCHAR(30) DEFAULT 'AGUARDANDO'
                      CHECK (status_pagamento IN ('AGUARDANDO','APROVADO','REJEITADO','ESTORNADO')),
    data_pagamento    TIMESTAMPTZ
);


-- ============================================================
-- 8) ENTREGADORES
-- ============================================================
CREATE TABLE IF NOT EXISTS entregadores (
    id              BIGSERIAL PRIMARY KEY,
    nome_completo   VARCHAR(150) NOT NULL,
    cpf             VARCHAR(14)  NOT NULL UNIQUE,
    telefone        VARCHAR(15)  NOT NULL UNIQUE,
    cidade          VARCHAR(100) NOT NULL,
    latitude_base   DOUBLE PRECISION,
    longitude_base  DOUBLE PRECISION,
    tipo_veiculo    VARCHAR(30)  NOT NULL
                    CHECK (tipo_veiculo IN ('BICICLETA','MOTO','CARRO_PEQUENO',
                                            'CARRO_UTILITARIO','CAMINHONETE','CAMINHAO')),
    placa_veiculo   VARCHAR(10),
    numero_cnh      VARCHAR(11),
    ativo           BOOLEAN DEFAULT FALSE,
    disponivel      BOOLEAN DEFAULT TRUE,
    data_cadastro   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entregadores_tipo  ON entregadores (tipo_veiculo);
CREATE INDEX IF NOT EXISTS idx_entregadores_ativo ON entregadores (ativo, disponivel);


-- ============================================================
-- 9) ENTREGAS
-- ============================================================
CREATE TABLE IF NOT EXISTS entregas (
    id                      BIGSERIAL PRIMARY KEY,
    status_entrega          VARCHAR(40) DEFAULT 'PEDIDO_RECEBIDO'
                            CHECK (status_entrega IN (
                                'PEDIDO_RECEBIDO','AGUARDANDO_ENTREGADOR','ENTREGADOR_ACEITOU',
                                'PEDIDO_EM_COLETA','SAIU_PARA_ENTREGA','ENTREGUE',
                                'RETIRADA_DISPONIVEL','CANCELADO'
                            )),
    endereco_entrega        TEXT,
    cidade_destino          VARCHAR(100),
    latitude_destino        DOUBLE PRECISION,
    longitude_destino       DOUBLE PRECISION,
    distancia_km            NUMERIC(8,2),
    valor_frete             NUMERIC(10,2),
    tipo_veiculo_necessario VARCHAR(30)
                            CHECK (tipo_veiculo_necessario IN ('BICICLETA','MOTO','CARRO_PEQUENO',
                                                               'CARRO_UTILITARIO','CAMINHONETE','CAMINHAO')),
    categoria_carga         VARCHAR(20)
                            CHECK (categoria_carga IN ('LEVE','MEDIA','PESADA','MUITO_PESADA')),
    peso_total_kg           NUMERIC(8,2),
    entregador_id           BIGINT REFERENCES entregadores(id),
    retirada_na_loja        BOOLEAN DEFAULT FALSE,
    codigo_rastreio         VARCHAR(50),
    data_atualizacao        TIMESTAMPTZ DEFAULT NOW(),
    data_entregue           TIMESTAMPTZ
);


-- ============================================================
-- 10) PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id            BIGSERIAL PRIMARY KEY,
    comprador_id  BIGINT REFERENCES usuarios(id),
    pagamento_id  BIGINT REFERENCES pagamentos(id),
    entrega_id    BIGINT REFERENCES entregas(id),
    valor_total   NUMERIC(10,2) NOT NULL,
    data_pedido   TIMESTAMPTZ DEFAULT NOW(),
    observacoes   TEXT
);

CREATE INDEX IF NOT EXISTS idx_pedidos_comprador ON pedidos (comprador_id);


-- ============================================================
-- 11) ITENS DO PEDIDO
-- preco_unitario_no_momento = trava o preço no instante da compra.
-- Se o vendedor mudar o preço depois, pedidos antigos não são afetados.
-- ============================================================
CREATE TABLE IF NOT EXISTS item_pedido (
    id                         BIGSERIAL PRIMARY KEY,
    pedido_id                  BIGINT REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id                 BIGINT REFERENCES produtos(id),
    quantidade                 INTEGER       NOT NULL,
    preco_unitario_no_momento  NUMERIC(10,2) NOT NULL
);


-- ============================================================
-- 12) CHATS e MENSAGENS (comprador conversa com loja)
-- ============================================================
CREATE TABLE IF NOT EXISTS chats (
    id            BIGSERIAL PRIMARY KEY,
    comprador_id  BIGINT REFERENCES usuarios(id),
    loja_id       BIGINT REFERENCES lojas(id),
    data_inicio   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comprador_id, loja_id)
);

CREATE INDEX IF NOT EXISTS idx_chats_comprador ON chats (comprador_id);
CREATE INDEX IF NOT EXISTS idx_chats_loja      ON chats (loja_id);

CREATE TABLE IF NOT EXISTS mensagens (
    id            BIGSERIAL PRIMARY KEY,
    chat_id       BIGINT REFERENCES chats(id) ON DELETE CASCADE,
    remetente_id  BIGINT REFERENCES usuarios(id),
    conteudo      TEXT NOT NULL,
    data_envio    TIMESTAMPTZ DEFAULT NOW(),
    lida          BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_mensagens_chat ON mensagens (chat_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_lida ON mensagens (lida);
-- "última mensagem por chat" usado na lista de conversas
CREATE INDEX IF NOT EXISTS idx_mensagens_chat_data ON mensagens (chat_id, data_envio DESC);
-- contagem rápida de não-lidas por chat/remetente
CREATE INDEX IF NOT EXISTS idx_mensagens_nao_lidas ON mensagens (chat_id, remetente_id, lida) WHERE lida = FALSE;


-- ============================================================
-- 13) RECEITAS (gerenciadas pelo admin/produtor)
-- ============================================================
CREATE TABLE IF NOT EXISTS receitas (
    id                BIGSERIAL PRIMARY KEY,
    autor_id          BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    titulo            VARCHAR(200) NOT NULL,
    descricao         TEXT,
    modo_preparo      TEXT         NOT NULL,
    tempo_preparo_min INTEGER      NOT NULL,
    imagem_url        TEXT,
    data_criacao      TIMESTAMPTZ  DEFAULT NOW()
);

-- M2M: receita usa produtos da plataforma como ingredientes
CREATE TABLE IF NOT EXISTS receita_ingredientes (
    receita_id  BIGINT NOT NULL REFERENCES receitas(id) ON DELETE CASCADE,
    produto_id  BIGINT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    PRIMARY KEY (receita_id, produto_id)
);


-- ============================================================
-- 14) BANNERS da home (carrossel gerenciado pelo admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS banners_home (
    id             BIGSERIAL PRIMARY KEY,
    tipo           VARCHAR(50)  NOT NULL DEFAULT 'DESTAQUE',
    titulo         VARCHAR(150) NOT NULL,
    subtitulo      TEXT,
    imagem_url     TEXT         NOT NULL,
    cor_destaque   VARCHAR(40)  DEFAULT 'text-[#f9943b]',
    link_blog_id   BIGINT,
    ordem          INTEGER      NOT NULL DEFAULT 0,
    ativo          BOOLEAN      NOT NULL DEFAULT TRUE,
    data_criacao   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_ativo_ordem ON banners_home (ativo, ordem);


-- ============================================================
-- 14b) ENDEREÇOS do usuário (para entregas)
-- ------------------------------------------------------------
-- Movido do localStorage do front para o backend — dados como CEP +
-- número da casa + telefone do destinatário são pessoais e devem
-- ficar isolados por usuario_id (RLS-style via JPA).
-- ============================================================
CREATE TABLE IF NOT EXISTS enderecos (
    id                  BIGSERIAL PRIMARY KEY,
    usuario_id          BIGINT       NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario        VARCHAR(100) NOT NULL,
    telefone            VARCHAR(15),
    cep                 VARCHAR(10)  NOT NULL,
    estado_cidade       VARCHAR(100) NOT NULL,
    bairro              VARCHAR(100) NOT NULL,
    rua                 VARCHAR(150) NOT NULL,
    numero              VARCHAR(20)  NOT NULL,
    complemento         VARCHAR(100),
    latitude_destino    DOUBLE PRECISION,
    longitude_destino   DOUBLE PRECISION,
    principal           BOOLEAN      NOT NULL DEFAULT FALSE,
    data_criacao        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enderecos_usuario ON enderecos (usuario_id, principal DESC);


-- ============================================================
-- 14c) CARTÕES salvos (PCI-aware — só últimos 4 dígitos)
-- ------------------------------------------------------------
-- Em produção real, isto seria substituído por TOKENS de PSP
-- (Stripe/Pagar.me) — NUNCA armazene PAN completo ou CVV.
-- Aqui guardamos apenas o que é seguro mostrar na UI.
-- ============================================================
CREATE TABLE IF NOT EXISTS cartoes (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      BIGINT       NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titular         VARCHAR(100) NOT NULL,
    final_cartao    VARCHAR(4)   NOT NULL,
    bandeira        VARCHAR(30),
    validade        VARCHAR(5)   NOT NULL,
    data_criacao    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cartoes_usuario ON cartoes (usuario_id);


-- ============================================================
-- 14d) NOTIFICAÇÕES (por usuário)
-- ------------------------------------------------------------
-- Cada notificação pertence a UM usuario_id. Notificações "globais"
-- devem ser fan-out (N entradas) — nunca expor cross-user na query.
-- ============================================================
CREATE TABLE IF NOT EXISTS notificacoes (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      BIGINT       NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo            VARCHAR(20)  NOT NULL DEFAULT 'SISTEMA'
                    CHECK (tipo IN ('PEDIDO','PROMOCAO','SISTEMA','CHAT','LOJA')),
    titulo          VARCHAR(150) NOT NULL,
    mensagem        TEXT         NOT NULL,
    link_acao       VARCHAR(255),
    lida            BOOLEAN      NOT NULL DEFAULT FALSE,
    data_criacao    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    data_leitura    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes (usuario_id, lida, data_criacao DESC);


-- ============================================================
-- 15) NOTÍCIAS (blog interno, gerenciado pelo admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS noticias (
    id                BIGSERIAL PRIMARY KEY,
    titulo            VARCHAR(200) NOT NULL,
    subtitulo         TEXT,
    categoria         VARCHAR(40)  DEFAULT 'NOTICIA',
    imagem_url        TEXT,
    descricao         TEXT,
    citacao           TEXT,
    tempo_leitura     VARCHAR(20)  DEFAULT '3 min',
    publicada         BOOLEAN      NOT NULL DEFAULT TRUE,
    data_criacao      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    data_atualizacao  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_noticias_publicada ON noticias (publicada, data_criacao DESC);


-- ============================================================
-- 16) Desativa Row Level Security em todas as tabelas de public.
-- Why: o backend conecta como superuser/role com acesso total.
-- Sem isso, no Supabase, RLS pode bloquear queries silenciosamente.
-- Em produção real, considere ativar RLS com policies adequadas.
-- ============================================================
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;
END $$;
