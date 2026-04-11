import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação das suas páginas (Verifique se os caminhos estão corretos)
import Home from './pages/Home/Home';
import Home2 from './pages/Home2/Home2';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Receitas from './pages/Home2/Receitas';

function App() {
  return (
    // O Router envolve toda a aplicação
    <Router>
      <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased">
        <Routes>
          {/* Rota Pública: Home Inicial */}
          <Route path="/" element={<Home />} />

          {/* Rota de Autenticação: Login e Cadastro */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          {/* Rota Logado: Home 2 (A que você mandou a imagem) */}
          <Route path="/home2" element={<Home2 />} />

          {/* Rota de Receitas */}
          <Route path="/receitas" element={<Receitas />} />

          {/* Redirecionamento de segurança: se digitar rota errada, volta pra Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;