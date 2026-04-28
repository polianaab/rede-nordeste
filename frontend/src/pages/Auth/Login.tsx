import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
// Importamos a função de login que está no seu api.ts
import { login } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();

  // Estados para capturar o que o usuário digita
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
  
      const dadosUsuario = await login(email, senha);


      localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));

      console.log("Login realizado com sucesso!");
      

      navigate('/home2');
      
    } catch (error: any) {
      alert("❌ " + error.message);
    } finally {
      setCarregando(false);
    }
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm font-medium" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="Sua senha" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm font-medium" 
            />
          </div>
          <div className="flex justify-center -mt-2">
            <button type="button" onClick={() => alert("Um link de recuperação será enviado para o seu e-mail em breve!")} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#55833d] transition-colors">
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={`w-full ${carregando ? 'bg-gray-400' : 'bg-[#55833d]'} text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-[#55833d]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}
          >
            {carregando ? 'Verificando...' : (
              <>
                Entrar na Rede <ArrowRight size={16} />
              </>
            )}
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