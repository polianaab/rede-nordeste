import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  // Inicializa o hook de navegação
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui no futuro vocês colocarão a lógica de validação do banco de dados
    console.log("Login realizado com sucesso!");

    // Redireciona para a Home2
    navigate('/home2');
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center px-6">
      <Link to="/" className="mb-10">
        <img src="/assets/logo-rede-nordeste.png" alt="Rede Nordeste" className="h-36" />
      </Link>

      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <h1 className="text-2xl font-black uppercase tracking-widest text-[#394158] mb-8 text-center">
          Bem-vindo de volta
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm font-medium" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Sua senha" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm font-medium" 
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#55833d] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-[#55833d]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Entrar na Rede <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/cadastro" className="text-sm font-medium text-[#394158]/50 hover:text-[#f9943b] transition-colors">
            Não tem conta? <span className="font-black">Cadastre-se aqui</span>
          </Link>
        </div>
      </div>
    </div>
  );
}