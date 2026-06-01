-- ============================================================
-- Rede Nordeste — Diagnóstico do banco
-- ============================================================
-- Use quando algo der errado e você quiser ver o estado atual.
-- NÃO altera o banco — apenas lê (SELECTs).
-- Rode o arquivo INTEIRO e copie o resultado para o chat de suporte.
-- ============================================================


-- 1) Quais tabelas existem no schema public?
SELECT table_name,
       pg_size_pretty(pg_total_relation_size(quote_ident(table_name)::regclass)) AS tamanho
  FROM information_schema.tables
 WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
 ORDER BY table_name;


-- 2) Quantas linhas em cada tabela principal?
SELECT 'usuarios'      AS tabela, COUNT(*) AS linhas FROM usuarios
UNION ALL SELECT 'sessoes',       COUNT(*) FROM sessoes
UNION ALL SELECT 'lojas',         COUNT(*) FROM lojas
UNION ALL SELECT 'categorias',    COUNT(*) FROM categorias
UNION ALL SELECT 'produtos',      COUNT(*) FROM produtos
UNION ALL SELECT 'item_carrinho', COUNT(*) FROM item_carrinho
UNION ALL SELECT 'pedidos',       COUNT(*) FROM pedidos
UNION ALL SELECT 'item_pedido',   COUNT(*) FROM item_pedido
UNION ALL SELECT 'pagamentos',    COUNT(*) FROM pagamentos
UNION ALL SELECT 'entregadores',  COUNT(*) FROM entregadores
UNION ALL SELECT 'entregas',      COUNT(*) FROM entregas
UNION ALL SELECT 'chats',         COUNT(*) FROM chats
UNION ALL SELECT 'mensagens',     COUNT(*) FROM mensagens
UNION ALL SELECT 'receitas',      COUNT(*) FROM receitas
UNION ALL SELECT 'banners_home',  COUNT(*) FROM banners_home
UNION ALL SELECT 'noticias',      COUNT(*) FROM noticias
ORDER BY tabela;


-- 3) Distribuição de usuários por perfil
SELECT tipo_perfil, COUNT(*) AS total,
       COUNT(*) FILTER (WHERE conta_ativa) AS ativos
  FROM usuarios
 GROUP BY tipo_perfil
 ORDER BY tipo_perfil;


-- 4) Distribuição de produtos por status
SELECT status, COUNT(*) AS total
  FROM produtos
 GROUP BY status
 ORDER BY status;


-- 5) Sessões ativas por usuário (debug de login)
SELECT u.email, u.tipo_perfil, COUNT(s.id) AS sessoes_ativas
  FROM usuarios u
  LEFT JOIN sessoes s ON s.usuario_id = u.id AND s.revogado_em IS NULL
 GROUP BY u.id, u.email, u.tipo_perfil
HAVING COUNT(s.id) > 0
 ORDER BY sessoes_ativas DESC;


-- 6) Lojas e seu estado (verificada / suspensa)
SELECT l.id, l.nome_loja, u.email AS dono,
       l.verificada, l.suspensa, l.cidade, l.estado
  FROM lojas l
  JOIN usuarios u ON u.id = l.usuario_id
 ORDER BY l.id;


-- 7) RLS — está desativado nas tabelas? (Importante no Supabase)
SELECT tablename, rowsecurity AS rls_ativa
  FROM pg_tables
 WHERE schemaname = 'public'
 ORDER BY tablename;
