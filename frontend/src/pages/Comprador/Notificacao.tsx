import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, Package, Tag, Truck, Info, Trash2
} from 'lucide-react';

const NOTIFICACOES_DATA = [
  {
    id: 1,
    tipo: 'pedido',
    titulo: 'Pedido a caminho!',
    mensagem: 'Seu pedido #4582 saiu para entrega e chega hoje. Prepare-se para receber seus produtos fresquinhos!',
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
    mensagem: 'Tomate Cereja Orgânico com 20% de desconto. Aproveite antes que o estoque acabe!',
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
    mensagem: 'Explore produtos de pequenos produtores da nossa terra e valorize o comércio local. Estamos felizes em ter você aqui.',
    tempo: 'Há 1 dia',
    lida: true,
    icone: Info,
    cor: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 4,
    tipo: 'pedido',
    titulo: 'Pedido Entregue',
    mensagem: 'Seu pedido #4510 foi entregue com sucesso. Avalie seus produtos e ajude a fortalecer nossos empreendedores!',
    tempo: 'Há 3 dias',
    lida: true,
    icone: Package,
    cor: 'text-[#394158]',
    bg: 'bg-[#394158]/10'
  }
];

export default function Notificacao() {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_DATA);

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
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased flex justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        
        {/* HEADER */}
        <header className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-white relative">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2">
              <Bell size={20} className="text-[#394158]" /> Notificações
            </h2>
            {naoLidas > 0 && (
              <span className="text-[10px] font-bold text-[#f9943b]">{naoLidas} não lidas</span>
            )}
          </div>
          <button onClick={limparNotificacoes} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-all active:scale-90" title="Limpar tudo">
            <Trash2 size={20} />
          </button>
        </header>

        {/* LISTA DE NOTIFICAÇÕES */}
        <div className="p-4 md:p-8 space-y-4 overflow-y-auto min-h-[500px] max-h-[700px] no-scrollbar bg-gray-50/50">
          {notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <div 
                key={notificacao.id} 
                onClick={() => marcarComoLida(notificacao.id)}
                className={`flex gap-4 p-5 md:p-6 rounded-3xl border-2 transition-all cursor-pointer group ${notificacao.lida ? 'bg-white border-transparent shadow-sm opacity-75' : 'bg-white border-[#55833d]/20 shadow-md'}`}
              >
                <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${notificacao.bg} ${notificacao.cor} group-hover:scale-110 transition-transform`}>
                  <notificacao.icone size={24} />
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1 md:mb-2">
                    <h3 className={`text-xs md:text-sm font-black uppercase tracking-widest ${notificacao.lida ? 'text-gray-500' : 'text-[#394158]'}`}>
                      {notificacao.titulo}
                    </h3>
                    {!notificacao.lida && <span className="w-2.5 h-2.5 bg-[#55833d] rounded-full flex-shrink-0 mt-1"></span>}
                  </div>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 leading-relaxed">
                    {notificacao.mensagem}
                  </p>
                  <span className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 mt-3 flex items-center gap-1">
                    {notificacao.tempo}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 flex flex-col items-center gap-4">
              <Bell size={48} className="text-gray-200" />
              <div className="text-gray-400 font-black uppercase tracking-widest italic text-xs">Nenhuma notificação por aqui</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
