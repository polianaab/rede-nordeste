import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { login } from '../../services/api';
// Importe o seu cliente do supabase aqui
// import { supabase } from '../../services/supabase'; 

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // Estados novos para a funcionalidade de esqueci senha
  const [exibirEsqueciSenha, setExibirEsqueciSenha] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    try {
      // Chamada real para o seu backend Java com banco de dados
      const dadosUsuario = await login(email, senha);
      localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));

      // Verificação do perfil vindo direto do banco de dados
      if (dadosUsuario.perfil === 'ADMIN') {
        navigate('/admin');
      } else if (dadosUsuario.perfil === 'PRODUTOR') {
        navigate('/vendedor');
      } else if (dadosUsuario.perfil === 'COMPRADOR') {
        navigate('/home2');
      } else {
        navigate('/');
      }

    } catch (error: any) {
      alert("❌ " + (error?.message || "Erro ao fazer login. Tente novamente."));
    } finally {
      setCarregando(false);
    } 
  };

  // Função para lidar com a recuperação de senha
  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    try {
      // Lógica do Supabase (substitua conforme sua configuração)
      // await supabase.auth.resetPasswordForEmail(emailRecuperacao, {
      //   redirectTo: 'https://seusite.vercel.app/redefinir-senha',
      // });
      alert("✅ Link de recuperação enviado para o seu e-mail!");
      setExibirEsqueciSenha(false);
    } catch (error: any) {
      alert("❌ Erro ao solicitar recuperação: " + error.message);
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
        
        {!exibirEsqueciSenha ? (
          /* FORMULÁRIO DE LOGIN ORIGINAL */
          <>
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
                  <button 
                    type="button"
                    onClick={() => setExibirEsqueciSenha(true)}
                    className="text-xs text-[#394158] font-semibold hover:text-[#f9943b] transition-colors bg-transparent border-none"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </div>
              <button
                type="submit" disabled={carregando}
                className={`w-full ${carregando ? 'bg-gray-400' : 'bg-[#55833d]'} text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2`}
              >
                {carregando ? 'Validando...' : 'Entrar na Rede'} <ArrowRight size={16} />
              </button>
            </form>
          </>
        ) : (
          /* NOVO FORMULÁRIO DE ESQUECI MINHA SENHA */
          <>
            <button 
              onClick={() => setExibirEsqueciSenha(false)}
              className="flex items-center gap-2 text-xs font-bold text-[#394158] mb-6 hover:text-[#f9943b] transition-colors"
            >
              <ArrowLeft size={16} /> VOLTAR AO LOGIN
            </button>
            <h1 className="text-2xl font-black uppercase tracking-widest text-[#394158] mb-4 text-center">
              Recuperar Senha
            </h1>
            <p className="text-sm text-gray-500 text-center mb-8 font-medium">
              Informe seu e-mail para receber um link de redefinição.
            </p>
            <form onSubmit={handleRecuperarSenha} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" placeholder="E-mail de cadastro" required 
                  value={emailRecuperacao} onChange={(e) => setEmailRecuperacao(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm font-medium" 
                />
              </div>
              <button
                type="submit" disabled={carregando}
                className={`w-full ${carregando ? 'bg-gray-400' : 'bg-[#f9943b]'} text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f9943b]/20`}
              >
                {carregando ? 'Enviando...' : 'Enviar Link'} <ArrowRight size={16} />
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center">
          <Link to="/cadastro" className="text-sm font-medium text-[#394158]/50 hover:text-[#f9943b]">
            Não tem conta? <span className="font-black">Cadastre-se aqui</span>
          </Link>
        </div>
      </div>
    </div>
  );
}