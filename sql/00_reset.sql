-- ============================================================
-- Rede Nordeste — RESET COMPLETO do banco (PostgreSQL / Supabase)
-- ============================================================
-- ⚠️  CUIDADO: este script APAGA TODAS as tabelas, sequences,
--     triggers e índices do schema `public`. Use apenas em ambiente
--     de desenvolvimento/demo para começar do zero.
--
-- Quando rodar:
--   • Após mudanças no schema (novas tabelas / colunas).
--   • Antes de redemonstrar para alunos / testar fluxos completos.
--   • Quando o banco fica em estado inconsistente entre demos.
--
-- Como usar (psql):
--   \c <seu_banco>
--   \i 00_reset.sql      → apaga tudo
--   \i 01_schema.sql     → recria todas as tabelas
--   \i 02_seed.sql       → popula categorias + banner inicial
--   Depois suba o backend (Spring Boot) — AdminSeeder + DemoSeeder
--   criarão os usuários, lojas, produtos, endereços, cartões,
--   pedidos e notificações de demonstração automaticamente.
--
-- Como usar (Supabase SQL Editor):
--   Cole o conteúdo deste arquivo e execute. Confirme o aviso
--   de destrutivo. Depois cole/execute 01_schema.sql e 02_seed.sql.
--
-- Idempotente: pode rodar várias vezes — todos os DROPs usam IF EXISTS.
-- ============================================================


-- ── 1) DROP de TODAS as tabelas do schema public ─────────────
-- Usamos DROP ... CASCADE para resolver dependências de FK
-- automaticamente, sem precisar manter a ordem manualmente.
-- O loop dinâmico funciona mesmo se aparecerem tabelas novas no futuro.
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', r.tablename);
    END LOOP;
END $$;


-- ── 2) DROP de TODAS as sequences órfãs (caso alguma sobreviva) ──
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN
        SELECT sequence_name FROM information_schema.sequences
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS public.%I CASCADE', r.sequence_name);
    END LOOP;
END $$;


-- ── 3) DROP de TODAS as views (se você tiver criado alguma) ──
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN
        SELECT table_name FROM information_schema.views
        WHERE table_schema = 'public'
    LOOP
        EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', r.table_name);
    END LOOP;
END $$;


-- ── 4) DROP de TODAS as funções/procedures do schema public ──
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN
        SELECT routine_name, routine_type FROM information_schema.routines
        WHERE routine_schema = 'public'
    LOOP
        IF r.routine_type = 'FUNCTION' THEN
            EXECUTE format('DROP FUNCTION IF EXISTS public.%I CASCADE', r.routine_name);
        ELSIF r.routine_type = 'PROCEDURE' THEN
            EXECUTE format('DROP PROCEDURE IF EXISTS public.%I CASCADE', r.routine_name);
        END IF;
    END LOOP;
END $$;


-- ── 5) DROP de TODOS os tipos enumerados customizados ────────
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN
        SELECT typname FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public' AND t.typtype = 'e'
    LOOP
        EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', r.typname);
    END LOOP;
END $$;


-- ── Verificação final (opcional) ─────────────────────────────
-- Após rodar, este SELECT deve retornar 0:
--   SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';
-- Se retornar > 0, alguma extensão criou tabelas que precisam de
-- DROP manual (ex: tabelas do Supabase Auth ficam em outro schema,
-- não em `public`, então este reset NÃO afeta usuários do Supabase Auth).
