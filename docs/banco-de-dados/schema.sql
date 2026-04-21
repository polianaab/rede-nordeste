CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE NOT NULL,
    telefone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    tipo_perfil VARCHAR(20) NOT NULL CHECK (tipo_perfil IN ('PRODUTOR', 'COMPRADOR', 'ADMIN')),
    foto_perfil_url TEXT,
    conta_ativa BOOLEAN NOT NULL DEFAULT FALSE,
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lojas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_loja VARCHAR(100) NOT NULL,
    descricao_bio TEXT,
    logradouro VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2) DEFAULT 'SE', 
    cep VARCHAR(8), 
    aceita_retirada BOOLEAN DEFAULT TRUE,
    faz_entrega BOOLEAN DEFAULT FALSE,
    valor_minimo_pedido DECIMAL(10,2) DEFAULT 0.00,
    taxa_entrega_fixa DECIMAL(10,2) DEFAULT 0.00,
    logo_url TEXT,
    data_abertura TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    imagem_icone_url TEXT
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    loja_id INTEGER REFERENCES lojas(id) ON DELETE CASCADE,
    categoria_id INTEGER REFERENCES categorias(id),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_atual DECIMAL(10,2) NOT NULL,
    unidade_medida VARCHAR(20) NOT NULL, 
    estoque_atual INTEGER DEFAULT 0,
    imagem_url TEXT,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE item_carrinho (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    data_adicao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, produto_id)
);


CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    metodo_pagamento VARCHAR(50) NOT NULL, 
    status_pagamento VARCHAR(30) DEFAULT 'AGUARDANDO' 
        CHECK (status_pagamento IN ('AGUARDANDO', 'APROVADO', 'REJEITADO', 'ESTORNADO')),
    data_pagamento TIMESTAMP WITH TIME ZONE
);

CREATE TABLE entregas (
    id SERIAL PRIMARY KEY,
    status_entrega VARCHAR(30) DEFAULT 'PENDENTE'
        CHECK (status_entrega IN ('PENDENTE', 'EM_PREPARACAO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'RETIRADA_DISPONIVEL')),
    endereco_entrega TEXT,
    codigo_rastreio VARCHAR(50),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    comprador_id INTEGER REFERENCES usuarios(id),
    pagamento_id INTEGER REFERENCES pagamentos(id),
    entrega_id INTEGER REFERENCES entregas(id),
    valor_total DECIMAL(10,2) NOT NULL,
    data_pedido TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT
);


CREATE TABLE item_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario_no_momento DECIMAL(10,2) NOT NULL
);


CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    comprador_id INTEGER REFERENCES usuarios(id),
    loja_id INTEGER REFERENCES lojas(id),
    data_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comprador_id, loja_id)
);

CREATE TABLE mensagens (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    remetente_id INTEGER REFERENCES usuarios(id),
    conteudo TEXT NOT NULL,
    data_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE
);