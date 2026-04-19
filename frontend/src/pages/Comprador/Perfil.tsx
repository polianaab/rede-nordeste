import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Lock, History, LogOut, Camera, 
  CheckCircle, MapPin, Mail, Phone, ShieldCheck 
} from 'lucide-react';

export default function Perfil() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('dados');

  // Dados simulados do usuário
  const [user, setUser] = useState({
    nome: 'Maria Silva Dias',
    documento: '088.345.670-00',
    telefone: '(75) 99823-6703',
    email: 'mariasilva43@gmail.com',
    cidade: 'Petrolina, PE',
    perfil: 'Comprador'
  });

  const handleLogout = () => {
    // Lógica para limpar sessão no futuro
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] font-sans pb-20">
      
      {/* HEADER DA PÁGINA */}
      <header className="w-full bg-white py-6 px-8 border-b border-gray-100 flex justify-center sticky top-0 z-10">
        <div className="w-full max-w-4xl flex justify-between items-center">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Meu Perfil</h2>
          <div className="flex gap-4">
             <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-red-500 hover:opacity-70 transition-all"
             >
               <LogOut size={16} /> Sair da Conta
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* NAVEGAÇÃO ENTRE ABAS */}
        <div className="flex justify-center gap-2 mb-10 bg-white/50 p-2 rounded-full w-fit mx-auto border border-white">
          <button 
            onClick={() => setAbaAtiva('dados')}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === 'dados' ? 'bg-[#802D44] text-white shadow-lg' : 'hover:bg-white'}`}
          >
            Dados Pessoais
          </button>
          <button 
            onClick={() => setAbaAtiva('senha')}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === 'senha' ? 'bg-[#802D44] text-white shadow-lg' : 'hover:bg-white'}`}
          >
            Alterar Senha
          </button>
          <button 
            onClick={() => setAbaAtiva('historico')}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === 'historico' ? 'bg-[#802D44] text-white shadow-lg' : 'hover:bg-white'}`}
          >
            Histórico
          </button>
        </div>

        {/* CARD PRINCIPAL DE IDENTIDADE */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 mb-8 flex flex-col items-center text-center relative border border-gray-50">
          <div className="relative group cursor-pointer mb-4">
            <img 
              src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200" 
              className="w-32 h-32 rounded-full object-cover border-4 border-[#F5F2ED] shadow-md group-hover:opacity-80 transition-all"
              alt="Avatar"
            />
            <div className="absolute bottom-0 right-0 bg-[#f9943b] text-white p-2 rounded-full border-4 border-white shadow-sm">
              <Camera size={16} />
            </div>
          </div>
          
          <h3 className="text-2xl font-black text-[#394158] leading-none mb-2">Olá, <span className="text-[#802D44]">{user.nome.split(' ')[0]}!</span></h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{user.perfil} • {user.cidade}</p>
          
          <div className="bg-[#55833d]/10 text-[#55833d] px-4 py-1.5 rounded-full flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
            <CheckCircle size={14} /> Conta Verificada
          </div>
        </div>

        {/* FORMULÁRIO DE DADOS */}
        <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/50 border border-gray-50">
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8 border-b pb-4 flex items-center gap-3">
             <ShieldCheck size={18} /> Meus Dados Públicos
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Nome Completo</label>
              <input 
                type="text" 
                value={user.nome} 
                className="w-full bg-[#F5F2ED]/50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#802D44]/20 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">CPF ou CNPJ</label>
              <input 
                type="text" 
                value={user.documento} 
                disabled
                className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm font-bold opacity-60 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Telefone</label>
              <input 
                type="text" 
                value={user.telefone} 
                className="w-full bg-[#F5F2ED]/50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#802D44]/20 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">E-mail</label>
              <input 
                type="email" 
                value={user.email} 
                className="w-full bg-[#F5F2ED]/50 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#802D44]/20 outline-none"
              />
            </div>
          </div>

          <button className="w-full mt-12 bg-[#802D44] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-[#394158] transition-all transform active:scale-95">
            Salvar Alterações
          </button>
        </div>

      </main>

      <footer className="w-full text-center mt-20 opacity-30">
         <span className="text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Rede Nordeste — Todos os direitos reservados.</span>
      </footer>
    </div>
  );
}