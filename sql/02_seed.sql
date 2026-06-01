-- ============================================================
-- Rede Nordeste — Seed didático (categorias + 1 banner)
-- ============================================================
-- Rode DEPOIS do 01_schema.sql.
-- Conteúdo:
--   • 10 categorias de produto (com ícones do flaticon).
--   • 1 banner inicial para a home não ficar vazia.
-- Não popula usuários — esses são criados pelo backend:
--   • ADMIN  → AdminSeeder (sempre, no startup).
--   • DEMO   → DemoSeeder  (se DEMO_SEED=true no .env).
--   • REAIS  → fluxo de cadastro em /cadastro.
-- Idempotente: pode rodar várias vezes sem erro.
-- ============================================================


-- ── CATEGORIAS ────────────────────────────────────────────────
INSERT INTO categorias (nome, descricao, imagem_icone_url) VALUES
    ('Hortifruti',         'Frutas, legumes e verduras frescas',           'https://cdn-icons-png.flaticon.com/512/2329/2329903.png'),
    ('Laticínios',         'Queijos, leite e coalhadas direto do produtor','https://cdn-icons-png.flaticon.com/512/2674/2674486.png'),
    ('Grãos',              'Feijão, milho, arroz e farinhas',              'https://cdn-icons-png.flaticon.com/512/1147/1147560.png'),
    ('Carnes',             'Carnes frescas e processadas',                 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'),
    ('Colheita',           'Produtos colhidos no dia',                     'https://cdn-icons-png.flaticon.com/512/2909/2909769.png'),
    ('Artesanato',         'Produtos feitos à mão por artesãos locais',    'https://cdn-icons-png.flaticon.com/512/3081/3081918.png'),
    ('Gastronomia',        'Pratos prontos e conservas',                   'https://cdn-icons-png.flaticon.com/512/3081/3081887.png'),
    ('Cama Mesa e Banho',  'Tecidos, toalhas e roupa de cama',             'https://cdn-icons-png.flaticon.com/512/2917/2917990.png'),
    ('Têxtil',             'Roupas, bordados e tecelagens',                'https://cdn-icons-png.flaticon.com/512/3637/3637758.png'),
    ('Bebidas',            'Sucos, polpas e licores artesanais',           'https://cdn-icons-png.flaticon.com/512/1719/1719923.png')
ON CONFLICT (nome) DO NOTHING;


-- ── BANNER inicial da home pública ────────────────────────────
INSERT INTO banners_home (tipo, titulo, subtitulo, imagem_url, cor_destaque, ordem, ativo)
SELECT 'SAFRA DO MÊS',
       'A melhor época para comprar manga',
       'Produtos frescos e com preços especiais direto do produtor.',
       'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000',
       'text-[#f9943b]', 1, TRUE
WHERE NOT EXISTS (SELECT 1 FROM banners_home);


-- ── Verificação ──────────────────────────────────────────────
-- Após rodar, espere ver:
--   SELECT COUNT(*) FROM categorias;   →  10
--   SELECT COUNT(*) FROM banners_home; →  1
