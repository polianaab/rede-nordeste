import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home            from './pages/Home/Home';
import Home2           from './pages/Comprador/HomeComprador';
import Login           from './pages/Auth/Login';
import Register        from './pages/Auth/Register';
import Receitas        from './pages/Comprador/Receitas';
import ProdutoDetalhes from './pages/Comprador/ProdutoDetalhes';
import Carrinho        from './pages/Comprador/Carrinho';
import Chat            from './pages/Comprador/Chat';
import Blog            from './pages/Blog/Blog';
import Post            from './pages/Blog/Post';
import Loja            from './pages/Comprador/Loja';
import Perfil          from './pages/Comprador/Perfil';
import Notificacao     from './pages/Comprador/Notificacao';
import HomeVendedor    from './pages/Vendedor/HomeVendedor';
import PainelVendedor  from './pages/Vendedor/PainelVendedor';
import HomeAdmin       from './pages/Admin/HomeAdmin';
import PerfilVendedor  from './pages/Vendedor/PerfilVendedor';
import ReceitasVendedor from './pages/Vendedor/ReceitasVendedor';

// ── Helpers ───────────────────────────────────────────────────
const getUsuario = () => {
  try {
    const raw = localStorage.getItem('usuarioLogado');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('usuarioLogado');
    return null;
  }
};

const getPerfil = (): string | null => getUsuario()?.perfil ?? null;

// ── Guardas ───────────────────────────────────────────────────
const RotaComprador = ({ children }: { children: React.ReactNode }) => {
  if (!getUsuario()) return <Navigate to="/login" replace />;
  const p = getPerfil();
  if (p === 'PRODUTOR') return <Navigate to="/vendedor" replace />;
  if (p === 'ADMIN')    return <Navigate to="/admin"   replace />;
  return <>{children}</>;
};

const RotaProdutor = ({ children }: { children: React.ReactNode }) => {
  if (!getUsuario()) return <Navigate to="/login" replace />;
  const p = getPerfil();
  if (p === 'COMPRADOR') return <Navigate to="/home2"   replace />;
  if (p === 'ADMIN')     return <Navigate to="/admin"   replace />;
  return <>{children}</>;
};

const RotaAdmin = ({ children }: { children: React.ReactNode }) => {
  if (!getUsuario()) return <Navigate to="/login" replace />;
  const p = getPerfil();
  if (p === 'PRODUTOR')  return <Navigate to="/vendedor" replace />;
  if (p === 'COMPRADOR') return <Navigate to="/home2"    replace />;
  return <>{children}</>;
};

// Chat acessível para qualquer perfil logado
const RotaChat = ({ children }: { children: React.ReactNode }) => {
  if (!getUsuario()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RotaAuth = ({ children }: { children: React.ReactNode }) => {
  const p = getPerfil();
  if (p === 'ADMIN')     return <Navigate to="/admin"    replace />;
  if (p === 'PRODUTOR')  return <Navigate to="/vendedor" replace />;
  if (p === 'COMPRADOR') return <Navigate to="/home2"    replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased">
        <Routes>

          {/* ── PÚBLICAS ─────────────────────────────────────── */}
          <Route path="/"         element={<Home />} />
          <Route path="/blog"     element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="/login"    element={<RotaAuth><Login /></RotaAuth>} />
          <Route path="/cadastro" element={<RotaAuth><Register /></RotaAuth>} />

          {/* ── COMPRADOR ────────────────────────────────────── */}
          <Route path="/home2"        element={<RotaComprador><Home2 /></RotaComprador>} />
          <Route path="/receitas"     element={<RotaComprador><Receitas /></RotaComprador>} />
          <Route path="/produto/:id"  element={<RotaComprador><ProdutoDetalhes /></RotaComprador>} />
          <Route path="/loja/:id"     element={<RotaComprador><Loja /></RotaComprador>} />
          <Route path="/carrinho"     element={<RotaComprador><Carrinho /></RotaComprador>} />
          <Route path="/notificacoes" element={<RotaComprador><Notificacao /></RotaComprador>} />
          <Route path="/perfil"       element={<RotaComprador><Perfil /></RotaComprador>} />

          {/* ── CHAT — qualquer perfil logado acessa ─────────── */}
          <Route path="/chat" element={<RotaChat><Chat /></RotaChat>} />

          {/* ── EMPREENDEDORAS — redireciona para home2 ──────── */}
          {/* FIX BUG 3: rota /empreendedoras não existia, caía no fallback */}
          <Route path="/empreendedoras" element={<RotaComprador><Home2 /></RotaComprador>} />

          {/* ── PRODUTOR ─────────────────────────────────────── */}
          <Route path="/vendedor"         element={<RotaProdutor><HomeVendedor /></RotaProdutor>} />
          <Route path="/painelvendedor"   element={<RotaProdutor><PainelVendedor /></RotaProdutor>} />
          <Route path="/perfilvendedor"   element={<RotaProdutor><PerfilVendedor /></RotaProdutor>} />
          <Route path="/receitasvendedor" element={<RotaProdutor><ReceitasVendedor /></RotaProdutor>} />

          {/* ── ADMIN ────────────────────────────────────────── */}
          <Route path="/admin" element={<RotaAdmin><HomeAdmin /></RotaAdmin>} />

          {/* ── FALLBACK ─────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;