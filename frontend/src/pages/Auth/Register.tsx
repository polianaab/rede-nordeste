import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, FileText, Store, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<'COMPRADOR' | 'VENDEDOR' | null>(null);
  const navigate = useNavigate();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile === 'VENDEDOR') {
      setStep(2);
    } else {
      console.log("Finalizar cadastro de comprador");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center py-10 px-6">
      {/* HEADER DA PÁGINA */}
      <div className="w-full max-w-md flex flex-col items-center mb-10">
        <Link to="/">
          <img src="/assets/logo-rede-nordeste.png" alt="Rede Nordeste" className="h-33 mb-1" />
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        
        {/* TÍTULO AGORA DENTRO DO CONTAINER */}
        <h1 className="text-2xl font-black uppercase tracking-widest text-[#394158] mb-8 text-center">
          {step === 1 ? 'Crie sua conta' : 'Sua Lojinha'}
        </h1>

        {step === 1 ? (
          /* --- ETAPA 1: DADOS PESSOAIS --- */
          <form onSubmit={handleNextStep} className="space-y-5">
            {/* SELEÇÃO DE PERFIL */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setProfile('VENDEDOR')}
                className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${
                  profile === 'VENDEDOR' ? 'border-[#55833d] bg-[#55833d]/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Store size={24} className={profile === 'VENDEDOR' ? 'text-[#55833d]' : 'text-gray-400'} />
                <span className={`text-[10px] font-black uppercase mt-2 ${profile === 'VENDEDOR' ? 'text-[#55833d]' : 'text-gray-500'}`}>Vendedor</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile('COMPRADOR')}
                className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${
                  profile === 'COMPRADOR' ? 'border-[#f9943b] bg-[#f9943b]/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <ShoppingBag size={24} className={profile === 'COMPRADOR' ? 'text-[#f9943b]' : 'text-gray-400'} />
                <span className={`text-[10px] font-black uppercase mt-2 ${profile === 'COMPRADOR' ? 'text-[#f9943b]' : 'text-gray-500'}`}>Comprador</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Nome Completo" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm" />
              </div>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="CPF ou CNPJ" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" placeholder="E-mail" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" placeholder="Senha" required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm" />
              </div>
            </div>

            <button
              disabled={!profile}
              type="submit"
              className="w-full bg-[#55833d] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-[#55833d]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {profile === 'VENDEDOR' ? 'Prosseguir para a Loja' : 'Finalizar Cadastro'} 
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          /* --- ETAPA 2: DADOS DA LOJA (PARA VENDEDORES) --- */
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 hover:text-[#394158] transition-colors">
              <ChevronLeft size={14} /> Voltar
            </button>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#394158] ml-2">Nome da Loja (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Sítio Esperança" 
                  className="w-full mt-1 px-5 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm" 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#394158] ml-2">O que você vende?</label>
                <textarea 
                  placeholder="Conte um pouco sobre seus produtos..." 
                  rows={3}
                  className="w-full mt-1 px-5 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-[#394158] transition-all outline-none text-sm resize-none" 
                />
              </div>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#55833d] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-[#55833d]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Finalizar Cadastro <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-sm font-medium text-[#394158]/50">
        Já tem uma conta? <Link to="/login" 
        className="text-[#55833d] font-black hover:underline">Entre agora</Link>
      </p>
    </div>
  );
}