import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, UtensilsCrossed, Clock, ChevronLeft } from 'lucide-react';

const RECEITAS_DATA = [
  { 
    id: 1, 
    titulo: 'Escondidinho de Carne de Sol', 
    tempo: '45 min', 
    dificuldade: 'Média',
    img: 'https://images.unsplash.com/photo-1626078436897-402b801a617d?auto=format&fit=crop&w=800&q=80',
    descricao: 'O clássico sertanejo com macaxeira cremosa e queijo coalho gratinado.'
  },
  { 
    id: 2, 
    titulo: 'Tapioca Gourmet de Queijo', 
    tempo: '10 min', 
    dificuldade: 'Fácil',
    img: 'https://images.unsplash.com/photo-1599331035313-91285f269a9e?auto=format&fit=crop&w=800&q=80',
    descricao: 'Rápida, crocante e recheada com o melhor queijo da nossa terra.'
  },
  { 
    id: 3, 
    titulo: 'Cuscuz Nordestino Completo', 
    tempo: '20 min', 
    dificuldade: 'Fácil',
    img: 'https://images.unsplash.com/photo-1589113331523-95889988960f?auto=format&fit=crop&w=800&q=80',
    descricao: 'O café da manhã perfeito com ovos caipira e queijo derretido.'
  }
];

export default function Receitas() {
  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased pb-20 font-sans">
      
      {/* NAVBAR (EXATAMENTE COMO A SUA) */}
      <header className="w-full bg-white py-4 px-8 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link to="/home2"><img src="/assets/logo-home.png" alt="Logo" className="h-14" /></Link>
            <nav className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <Link to="/home2" className="hover:text-[#55833d] transition-colors">Início</Link>
              <Link to="/receitas" className="text-[#55833d] border-b-2 border-[#55833d] pb-1">Receitas</Link>
              <Link to="/noticias" className="hover:text-[#f9943b]">Notícias</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <ShoppingCart size={22} className="cursor-pointer" />
            <User size={22} className="cursor-pointer" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pt-12">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/home2" className="p-2 bg-white rounded-full shadow-sm hover:text-[#f9943b] transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3 text-[#55833d]">
            <UtensilsCrossed size={28} />
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Sabores do Sertão</h1>
          </div>
        </div>

        <p className="text-[#394158]/60 max-w-2xl mb-12 font-medium">
          Descubra como transformar os produtos da nossa terra em pratos inesquecíveis. Receitas tradicionais com um toque de inovação.
        </p>

        {/* GRADE DE RECEITAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {RECEITAS_DATA.map(rec => (
            <div key={rec.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 group hover:-translate-y-2 transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <img src={rec.img} alt={rec.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#394158]">
                  <Clock size={14} className="text-[#f9943b]" /> {rec.tempo}
                </div>
              </div>
              
              <div className="p-8">
                <span className="text-[#55833d] text-[10px] font-black uppercase tracking-widest mb-2 block italic">
                  {rec.dificuldade}
                </span>
                <h3 className="text-2xl font-black text-[#394158] mb-4 uppercase italic leading-tight">
                  {rec.titulo}
                </h3>
                <p className="text-sm text-[#394158]/50 leading-relaxed mb-8">
                  {rec.descricao}
                </p>
                <button className="w-full py-4 bg-[#394158] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#f9943b] transition-all">
                  Ver Receita Completa
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="w-full text-center p-10 bg-gray-50 text-[#394158]/20">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Rede Nordeste</span>
      </footer>
    </div>
  );
}