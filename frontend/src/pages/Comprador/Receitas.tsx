import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, User, UtensilsCrossed, Clock, 
  ChevronLeft, X, Flame, ChefHat, ScrollText, ShoppingBag, MessageCircle
} from 'lucide-react';

const RECEITAS_DATA = [
  { 
    id: 1, 
    titulo: 'Escondidinho de Carne de Sol', 
    tempo: '45 min', 
    dificuldade: 'Média',
    img: 'https://images.unsplash.com/photo-1626078436897-402b801a617d?auto=format&fit=crop&w=800&q=80',
    descricao: 'O clássico sertanejo com macaxeira cremosa e queijo coalho gratinado.',
    ingredientes: ['500g de carne de sol', '1kg de macaxeira cozida', '200g de queijo coalho', '1 cebola roxa', 'Nata a gosto'],
    preparo: 'Dessalgue a carne, refogue com cebola. Amasse a macaxeira com nata para o purê. Monte em camadas e gratine com o queijo.'
  },
  { 
    id: 2, 
    titulo: 'Tapioca Gourmet de Queijo', 
    tempo: '10 min', 
    dificuldade: 'Fácil',
    img: 'https://images.unsplash.com/photo-1599331035313-91285f269a9e?auto=format&fit=crop&w=800&q=80',
    descricao: 'Rápida, crocante e recheada com o melhor queijo da nossa terra.',
    ingredientes: ['1 xícara de goma de tapioca', '2 fatias grossas de queijo coalho', 'Manteiga de garrafa'],
    preparo: 'Peneire a goma na frigideira quente. Quando ligar, coloque o queijo. Dobre e pincele manteiga de garrafa.'
  },
  { 
    id: 3, 
    titulo: 'Cuscuz Nordestino Completo', 
    tempo: '20 min', 
    dificuldade: 'Fácil',
    img: 'https://images.unsplash.com/photo-1589113331523-95889988960f?auto=format&fit=crop&w=800&q=80',
    descricao: 'O café da manhã perfeito com ovos caipira e queijo derretido.',
    ingredientes: ['2 xícaras de flocão de milho', '1 xícara de água', 'Sal a gosto', 'Ovos e queijo para acompanhar'],
    preparo: 'Hidrate o flocão por 10 min. Cozinhe no vapor por 10 min. Sirva com ovos fritos na manteiga e queijo derretido.'
  }
];

export default function Receitas() {
  const [receitaAberta, setReceitaAberta] = useState<any>(null);
  const navigate = useNavigate();

  // --- LÓGICA DO CARRINHO PERSISTENTE ---
  const [carrinhoCount, setCarrinhoCount] = useState(() => {
    const salvo = localStorage.getItem('carrinho_count');
    return salvo ? parseInt(salvo) : 0;
  });

  useEffect(() => {
    const atualizarCarrinho = () => {
      const salvo = localStorage.getItem('carrinho_count');
      setCarrinhoCount(salvo ? parseInt(salvo) : 0);
    };
    window.addEventListener('storage', atualizarCarrinho);
    return () => window.removeEventListener('storage', atualizarCarrinho);
  }, []);

  const extrairTermoBusca = (ingrediente: string) => {
    return ingrediente
      .replace(/^\d+(g|kg| xícara| fatias)?\s*(de\s*)?/i, '')
      .replace(/a gosto/i, '')
      .trim();
  };

  const comprarIngrediente = (ingrediente: string) => {
    const termo = extrairTermoBusca(ingrediente);
    navigate('/home2', { state: { buscaReceita: termo } });
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased pb-20 font-sans">
      
      {/* NAVBAR */}
      <header className="w-full bg-white py-4 px-8 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link to="/home2">
              <img 
                src="/assets/logo-home.png" 
                alt="Logo" 
                className="h-14 w-auto object-contain block" 
              />
            </Link>
            <nav className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <Link to="/home2" className="hover:text-[#55833d] transition-colors">Início</Link>
              <Link to="/receitas" className="text-[#55833d] border-b-2 border-[#55833d] pb-1">Receitas</Link>
              <Link to="/noticias" className="hover:text-[#f9943b]">Notícias</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* ÍCONE DE CHAT */}
            <Link to="/chat" className="text-[#394158] hover:text-[#55833d] transition-all">
              <MessageCircle size={22} />
            </Link>

            {/* ÍCONE DE CARRINHO COM CONTADOR */}
            <Link to="/carrinho" className="relative cursor-pointer group">
              <ShoppingCart size={22} className="group-hover:text-[#55833d] transition-colors" />
              {carrinhoCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#f9943b] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {carrinhoCount}
                </span>
              )}
            </Link>

            <User size={22} className="cursor-pointer hover:text-[#55833d] transition-colors" />
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

        <p className="text-[#394158]/60 max-w-2xl mb-12 font-medium leading-relaxed">
          Receitas tradicionais criadas pelas nossas especialistas para valorizar os produtos da terra.
        </p>

        {/* GRADE DE RECEITAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {RECEITAS_DATA.map(rec => (
            <div key={rec.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 group hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-[#55833d]/20">
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img 
                  src={rec.img} 
                  alt={rec.titulo} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#394158]">
                  <Clock size={14} className="text-[#f9943b]" /> {rec.tempo}
                </div>
              </div>
              
              <div className="p-8">
                <span className="text-[#55833d] text-[10px] font-black uppercase tracking-widest italic mb-2 block">{rec.dificuldade}</span>
                <h3 className="text-2xl font-black text-[#394158] mb-4 uppercase italic leading-tight">{rec.titulo}</h3>
                <p className="text-sm text-[#394158]/50 leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">{rec.descricao}</p>
                <button onClick={() => setReceitaAberta(rec)} className="w-full py-4 bg-[#394158] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#55833d] transition-all">
                  Ver Receita Completa
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL CORRIGIDO */}
      {receitaAberta && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-[#394158]/90 backdrop-blur-md" onClick={() => setReceitaAberta(null)}></div>
          
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-[3.5rem] relative z-10 overflow-hidden shadow-2xl flex flex-col">
            
            <button onClick={() => setReceitaAberta(null)} className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-30 shadow-md">
              <X size={20} />
            </button>

            <div className="overflow-y-auto no-scrollbar">
              <div className="w-full h-[300px] md:h-[400px] relative overflow-hidden bg-gray-200">
                <img 
                  src={receitaAberta.img} 
                  className="w-full h-full object-cover block absolute inset-0" 
                  alt={receitaAberta.titulo}
                />
              </div>
              
              <div className="p-8 md:p-12 bg-white relative">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="flex gap-4">
                    <span className="bg-[#F5F2ED] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} className="text-[#f9943b]" /> {receitaAberta.tempo}
                    </span>
                    <span className="bg-[#F5F2ED] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Flame size={14} className="text-[#55833d]" /> {receitaAberta.dificuldade}
                    </span>
                  </div>
                </div>

                <h2 className="text-4xl font-black text-[#394158] uppercase italic mb-8 tracking-tighter leading-none">
                  {receitaAberta.titulo}
                </h2>

                <div className="space-y-12">
                  <div>
                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#394158]/40 mb-6 border-b pb-2">
                      <ChefHat size={18} /> Ingredientes (Clique p/ comprar)
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {receitaAberta.ingredientes.map((ing: string, i: number) => (
                        <li key={i} onClick={() => comprarIngrediente(ing)} className="group cursor-pointer flex items-center gap-3 bg-[#F5F2ED]/50 p-4 rounded-2xl hover:bg-[#f9943b]/10 transition-all border border-transparent hover:border-[#f9943b]/20">
                          <ShoppingBag size={16} className="text-[#394158]/20 group-hover:text-[#f9943b]" />
                          <span className="text-sm font-bold text-[#394158]/80 group-hover:text-[#f9943b]">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#F5F2ED] p-8 md:p-10 rounded-[3rem] border border-[#394158]/5">
                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#394158] mb-6">
                      <ScrollText size={18} /> Modo de Preparo
                    </h4>
                    <p className="text-base font-medium leading-relaxed text-[#394158]/80 whitespace-pre-line italic">
                      {receitaAberta.preparo}
                    </p>
                  </div>
                </div>

                <button onClick={() => setReceitaAberta(null)} className="w-full mt-12 py-6 bg-[#394158] text-white text-xs font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-[#55833d] transition-all shadow-xl">
                  Voltar para as receitas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full text-center p-20 bg-gray-50 text-[#394158]/60">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Rede Nordeste - Todos os direitos reservados.</span>
      </footer>
    </div>
  );
}