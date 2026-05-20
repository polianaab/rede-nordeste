import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Package, Tag, Truck, Info, Trash2, Search, X, CheckCheck
} from 'lucide-react';

const NOTIFICACOES_DATA = [
  {
    id: 1,
    tipo: 'pedido',
    titulo: 'Pedido a caminho!',
    mensagem: 'Seu pedido #4582 saiu para entrega e chega hoje.',
    tempo: 'Há 2 horas',
    lida: false,
    icone: Truck,
    cor: 'text-[#f9943b]',
    bg: 'bg-[#f9943b]/10'
  },
  {
    id: 2,
    tipo: 'promocao',
    titulo: 'Promoção do Dia 🍎',
    mensagem: 'Tomate Cereja Orgânico com 20% de desconto.',
    tempo: 'Há 5 horas',
    lida: false,
    icone: Tag,
    cor: 'text-[#55833d]',
    bg: 'bg-[#55833d]/10'
  },
  {
    id: 3,
    tipo: 'sistema',
    titulo: 'Bem-vindo(a) à Rede Nordeste',
    mensagem: 'Explore produtos de pequenos produtores da nossa terra.',
    tempo: 'Há 1 dia',
    lida: true,
    icone: Info,
    cor: 'text-blue-500',
    bg: 'bg-blue-500/10'
  }
];

export default function Notificacao() {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_DATA);
  const [busca, setBusca] = useState('');

  const marcarComoLida = (id: number) => {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const limparNotificacoes = () => {
    if(window.confirm('Deseja limpar todas as notificações?')) {
      setNotificacoes([]);
    }
  };

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="min-h-screen bg-[#F5F2ED]/50 flex justify-center items-start pt-20 px-4 font-sans antialiased">
      {/* Container Estilo Dropdown Shopee */}
      <div className="w-full max-w-[420px] bg-white rounded-[1rem] shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border border-gray-100 animate-in slide-in-from-top-5 duration-300">
        
        {/* HEADER COMPACTO */}
        <header className="p-4 border-b border-gray-50 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#394158] uppercase italic tracking-tighter flex items-center gap-2">
              Notificações {naoLidas > 0 && <span className="text-[#f9943b]">({naoLidas})</span>}
            </h2>
            <div className="flex items-center gap-1">
               <button onClick={limparNotificacoes} className="p-2 text-gray-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50" title="Limpar tudo">
                 <Trash2 size={18} />
               </button>
               <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-[#394158] transition-all rounded-full hover:bg-gray-50">
                 <X size={18} />
               </button>
            </div>
          </div>

          {/* BARRA DE BUSCA IGUAL AO PRINT */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#f9943b] transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Buscar nas notificações..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-gray-50 py-2 pl-9 pr-4 rounded-[0.5rem] text-xs font-medium outline-none focus:ring-1 focus:ring-[#f9943b]/30 border border-transparent focus:border-[#f9943b]/20 transition-all"
            />
          </div>
        </header>

        {/* TABS SIMULADAS (TODOS / NÃO LIDAS) */}
        <div className="flex px-4 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <button className="py-3 text-[#f9943b] border-b-2 border-[#f9943b]">Todos</button>
            <button className="py-3 px-6 hover:text-[#394158] transition-colors">Pedidos</button>
            <button className="py-3 hover:text-[#394158] transition-colors">Promoções</button>
        </div>

        {/* LISTA DE NOTIFICAÇÕES COMPACTA */}
        <div className="overflow-y-auto max-h-[450px] no-scrollbar">
          {notificacoes.length > 0 ? (
            notificacoes.map((n) => (
              <div 
                key={n.id} 
                onClick={() => marcarComoLida(n.id)}
                className={`flex gap-4 p-4 border-b border-gray-50 transition-all cursor-pointer hover:bg-gray-50 relative ${!n.lida ? 'bg-[#f9943b]/5' : 'bg-white'}`}
              >
                {/* ÍCONE CIRCULAR */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${n.bg} ${n.cor} shadow-sm`}>
                  <n.icone size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`text-[11px] font-black uppercase truncate pr-4 ${!n.lida ? 'text-[#394158]' : 'text-gray-500'}`}>
                      {n.titulo}
                    </h3>
                    <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">{n.tempo}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 line-clamp-2 leading-snug">
                    {n.mensagem}
                  </p>
                </div>

                {/* INDICADOR DE NÃO LIDA (BOLINHA) */}
                {!n.lida && (
                  <div className="absolute right-4 bottom-4 w-2 h-2 bg-[#f9943b] rounded-full shadow-[0_0_10px_#f9943b]"></div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 flex flex-col items-center gap-3 opacity-30">
              <Bell size={40} />
              <p className="font-black uppercase italic text-[10px]">Tudo limpo por aqui</p>
            </div>
          )}
        </div>

        {/* FOOTER VER TUDO */}
        <footer className="p-3 bg-gray-50/50 text-center border-t border-gray-100">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f9943b] hover:underline transition-all">
                Ver histórico completo
            </button>
        </footer>
      </div>
    </div>
  );
}