import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { login } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setCarregando(true);
  try {
    const dadosUsuario = await login(email, senha);
    localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));

    // Redireciona conforme perfil
    if (dadosUsuario.perfil === 'PRODUTOR') {
      navigate('/produtor/home');
    } else if (dadosUsuario.perfil === 'COMPRADOR') {
      navigate('/comprador/home');
    } else {
      navigate('/home');
    }

  } catch (error: any) {
  // error já é um Error com .message graças ao interceptor
  alert("❌ " + (error?.message || "Erro ao fazer login. Tente novamente."));
  } finally {
  setCarregando(false);
  } 
};  

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center px-6">
      <Link to="/" className="mb-10">
        <img src="/assets/logo-login.png" alt="Rede Nordeste" className="h-36" />
      </Link>
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h1 className="text-2xl font-black uppercase tracking-widest text-[#394158] mb-8 text-center">
          Bem-vindo de volta
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" placeholder="Seu e-mail" required 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm font-medium" 
            />
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" placeholder="Sua senha" required 
                value={senha} onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm font-medium" 
              />
            </div>
            <div className="flex justify-center mt-4 px-2">
              <Link to="/esqueci-senha" className="text-xs text-[#394158] font-semibold hover:text-[#f9943b] transition-colors">
                Esqueci minha senha
              </Link>
            </div>
          </div>
          <button
            type="submit" disabled={carregando}
            className={`w-full ${carregando ? 'bg-gray-400' : 'bg-[#55833d]'} text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2`}
          >
            {carregando ? 'Validando...' : 'Entrar na Rede'} <ArrowRight size={16} />
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link to="/cadastro" className="text-sm font-medium text-[#394158]/50 hover:text-[#f9943b]">
            Não tem conta? <span className="font-black">Cadastre-se aqui</span>
          </Link>
        </div>
      </div>
    </div>
  );
}