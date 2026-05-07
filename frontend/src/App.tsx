import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação das suas páginas
import Home from './pages/Home/Home';
import Home2 from './pages/Comprador/HomeComprador';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Receitas from './pages/Comprador/Receitas';
import ProdutoDetalhes from './pages/Comprador/ProdutoDetalhes'; 
import Carrinho from './pages/Comprador/Carrinho';
import Chat from './pages/Comprador/Chat'; 
import Blog from './pages/Blog/Blog';
import Post from './pages/Blog/Post';
import Perfil from './pages/Comprador/Perfil';
import Notificacao from './pages/Comprador/Notificacao';
import HomeVendedor from './pages/Vendedor/HomeVendedor';
import PainelVendedor from './pages/Vendedor/PainelVendedor';
import HomeAdmin from './pages/Admin/HomeAdmin';

// Verificação de autenticação antes da liberação da página
const RotaPrivada = ({ children }: { children: React.ReactNode }) => {
  const usuario = localStorage.getItem('usuarioLogado');
  
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="/admin-teste" element={<HomeAdmin />} />

          {/* Rotas Privadas - Comprador */}
          <Route path="/home2" element={
            <RotaPrivada><Home2 /></RotaPrivada>
          } />
          <Route path="/receitas" element={
            <RotaPrivada><Receitas /></RotaPrivada>
          } />
          <Route path="/produto/:id" element={
            <RotaPrivada><ProdutoDetalhes /></RotaPrivada>
          } />
          <Route path="/carrinho" element={
            <RotaPrivada><Carrinho /></RotaPrivada>
          } />
          <Route path="/chat" element={
            <RotaPrivada><Chat /></RotaPrivada>
          } />
          <Route path="/notificacoes" element={
            <RotaPrivada><Notificacao /></RotaPrivada>
          } />
          <Route path="/perfil" element={
            <RotaPrivada><Perfil /></RotaPrivada>
          } />

          {/* Rotas Privadas - Vendedor */}
          <Route path="/vendedor" element={
            <RotaPrivada><HomeVendedor /></RotaPrivada>
          } />
          <Route path="/painelvendedor" element={
            <RotaPrivada><PainelVendedor /></RotaPrivada>
          } />

          {/* Rota de Fallback (Página não encontrada) */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;