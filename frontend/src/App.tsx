import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação das suas páginas
import Home from './pages/Home/Home';
import Home2 from './pages/Home2/Home2';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Receitas from './pages/Home2/Receitas';
// 1. ADICIONADO: Import do componente de detalhes
import ProdutoDetalhes from './pages/Home2/ProdutoDetalhes'; 

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

          {/* 2. ADICIONADO: Rota dinâmica para detalhes do produto */}
          <Route path="/produto/:id" element={<ProdutoDetalhes />} />

          {/* Redirecionamento de segurança: sempre por último */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;