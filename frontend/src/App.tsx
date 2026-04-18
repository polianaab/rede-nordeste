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
import Chat from './pages/Comprador/Chat'; // Importe o componente de Chat aqui
import Blog from './pages/Blog/Blog';
import Post from './pages/Blog/Post';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/produto/:id" element={<ProdutoDetalhes />} />
          <Route path="/carrinho" element={<Carrinho />} />
          {/* NOVA ROTA DO CHAT */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;