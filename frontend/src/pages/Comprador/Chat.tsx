import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, ArrowLeft, ShieldAlert, Store, 
  Lock, CheckCheck, ChevronRight, MessageSquare 
} from 'lucide-react';

// Dados simulados baseados na sua tabela 'chats'
const LISTA_CHATS = [
  { id: 1, loja_nome: 'Fazenda Alvorada', ultima_msg: 'Olá! Como posso ajudar?', data: '14:20', online: true },
  { id: 2, loja_nome: 'Sítio Girassol', ultima_msg: 'Seu pedido saiu para entrega!', data: 'Ontem', online: false },
  { id: 3, loja_nome: 'Laticínios Glória', ultima_msg: 'O queijo coalho está fresquinho.', data: 'Terça', online: true },
];

export default function Chat() {
  const navigate = useNavigate();
  const [chatAtivo, setChatAtivo] = useState<any>(null); // Armazena qual chat está aberto
  const [mensagem, setMensagem] = useState('');
  const [bloqueado, setBloqueado] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulação de mensagens (na real viria da tabela 'mensagens')
  const [conversa, setConversa] = useState([
    { id: 1, remetente: 'loja', texto: 'Olá! Como posso ajudar com seu pedido?', data: '14:20' }
  ]);

  const padraoContato = /(\d{2,5}\s?9?\d{4}[-\s]?\d{4})|([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})|(www\.|http|https|\.com|\.br)/gi;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conversa, chatAtivo]);

  const validarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    if (padraoContato.test(mensagem)) {
      setBloqueado(true);
      setTimeout(() => setBloqueado(false), 4000);
      return;
    }

    const novaMsg = {
      id: Date.now(),
      remetente: 'usuario',
      texto: mensagem,
      data: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversa([...conversa, novaMsg]);
    setMensagem('');
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex justify-center items-center p-4 font-sans text-[#394158]">
      <div className="bg-white w-full max-w-md h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        
        {/* VISÃO 1: LISTA DE TODAS AS CONVERSAS */}
        {!chatAtivo ? (
          <>
            <header className="p-8 border-b border-gray-50 bg-white">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/home2')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="font-black uppercase italic text-lg tracking-tighter">Minhas Conversas</h2>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center opacity-20"><MessageSquare size={18}/></div>
                <input type="text" placeholder="Procurar vendedor..." className="w-full bg-gray-50 py-3 pl-12 pr-4 rounded-2xl text-xs font-bold outline-none" />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {LISTA_CHATS.map((chat) => (
                <button 
                  key={chat.id} 
                  onClick={() => setChatAtivo(chat)}
                  className="w-full p-5 rounded-[2rem] hover:bg-gray-50 transition-all flex items-center gap-4 group"
                >
                  <div className="relative">
                    <div className="w-14 h-14 bg-[#55833d]/10 rounded-2xl flex items-center justify-center text-[#55833d]">
                      <Store size={24} />
                    </div>
                    {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#55833d] border-4 border-white rounded-full"></div>}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-black uppercase italic text-xs tracking-tight">{chat.loja_nome}</h4>
                      <span className="text-[9px] font-bold opacity-30">{chat.data}</span>
                    </div>
                    <p className="text-xs text-[#394158]/50 truncate font-medium">{chat.ultima_msg}</p>
                  </div>
                  <ChevronRight size={16} className="opacity-10 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </>
        ) : (
          /* VISÃO 2: CHAT ABERTO (MESMA LÓGICA ANTERIOR) */
          <>
            <header className="p-6 border-b border-gray-50 flex items-center gap-4 bg-white sticky top-0 z-10">
              <button onClick={() => setChatAtivo(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <ArrowLeft size={20} />
              </button>
              <div className="w-12 h-12 bg-[#55833d]/10 rounded-2xl flex items-center justify-center text-[#55833d]">
                <Store size={22} />
              </div>
              <div>
                <h3 className="font-black uppercase italic text-sm tracking-tighter">{chatAtivo.loja_nome}</h3>
                <div className="flex items-center gap-1 text-[9px] font-bold text-[#55833d] uppercase tracking-widest">
                  {chatAtivo.online ? "Online AGORA" : "Visto recentemente"}
                </div>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/30">
              <div className="bg-[#394158]/5 p-4 rounded-2xl border border-[#394158]/5 flex items-start gap-3 mb-6 text-[10px] font-bold uppercase tracking-tight text-[#394158]/50">
                <Lock size={14} className="mt-0.5" />
                Segurança Rede Nordeste: Troca de contatos só após a compra.
              </div>

              {conversa.map((msg) => (
                <div key={msg.id} className={`flex ${msg.remetente === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-[1.5rem] shadow-sm ${
                    msg.remetente === 'usuario' ? 'bg-[#55833d] text-white rounded-tr-none' : 'bg-white rounded-tl-none border border-gray-100'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.texto}</p>
                    <div className="flex items-center gap-1 mt-1 text-[8px] font-black uppercase tracking-widest opacity-50 justify-end">
                      {msg.data} {msg.remetente === 'usuario' && <CheckCheck size={10} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {bloqueado && (
              <div className="mx-6 mb-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
                <ShieldAlert className="text-red-500" size={18} />
                <p className="text-[9px] font-black uppercase text-red-500">Bloqueado: Não envie telefones ou links antes da compra.</p>
              </div>
            )}

            <footer className="p-6 bg-white border-t border-gray-100">
              <form onSubmit={validarEnvio} className="flex gap-3 relative">
                <input 
                  type="text" 
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Escreva aqui..." 
                  className="flex-1 bg-gray-50 p-4 pr-12 rounded-2xl text-sm font-bold outline-none"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#394158] text-white p-2.5 rounded-xl hover:bg-[#55833d] transition-all"><Send size={18} /></button>
              </form>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}