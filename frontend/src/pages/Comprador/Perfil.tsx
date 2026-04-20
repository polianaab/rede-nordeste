import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, LogOut, Camera, CheckCircle, 
  Wallet, Package, Truck, CheckSquare,
  Heart, History, RotateCcw, HelpCircle,
  ChevronRight, ShieldCheck, Settings, ArrowLeft,
  MapPin, CreditCard, Bell, Lock, Smartphone
} from 'lucide-react';

export default function Perfil() {
  const navigate = useNavigate();
  // Estados para controlar o que está sendo exibido
  const [telaAtual, setTelaAtual] = useState<'perfil' | 'configuracoes'>('perfil');
  const [secaoConfig, setSecaoConfig] = useState<'menu' | 'conta' | 'enderecos' | 'cartoes'>('menu');

  // Renderização da Tela de Configurações
  const renderConfiguracoes = () => {
    switch (secaoConfig) {
      case 'conta':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <button onClick={() => setSecaoConfig('menu')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4"><ArrowLeft size={14}/> Voltar</button>
            <h3 className="text-xl font-black uppercase italic text-[#802D44]">Conta e Segurança</h3>
            <div className="grid gap-4">
              {['Nome', 'E-mail', 'Telefone', 'Senha'].map((item) => (
                <div key={item} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[9px] font-black uppercase text-gray-400">{item}</p>
                    <p className="text-sm font-bold">{item === 'Senha' ? '********' : `Alterar ${item}`}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'enderecos':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <button onClick={() => setSecaoConfig('menu')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4"><ArrowLeft size={14}/> Voltar</button>
            <h3 className="text-xl font-black uppercase italic text-[#802D44]">Meus Endereços</h3>
            <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 text-center text-gray-400 py-10">
              <MapPin size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs font-bold uppercase">Nenhum endereço cadastrado</p>
              <button className="mt-4 text-[#802D44] font-black text-[10px] uppercase border-b border-[#802D44]">+ Adicionar Novo</button>
            </div>
          </div>
        );
      case 'cartoes':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <button onClick={() => setSecaoConfig('menu')} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-4"><ArrowLeft size={14}/> Voltar</button>
            <h3 className="text-xl font-black uppercase italic text-[#802D44]">Contas Bancárias</h3>
            <div className="bg-[#394158] p-6 rounded-3xl text-white relative overflow-hidden shadow-xl mb-4">
              <CreditCard size={24} className="mb-8" />
              <p className="text-lg tracking-widest font-mono">**** **** **** 4452</p>
              <div className="flex justify-between mt-4">
                <span className="text-[10px] uppercase font-black opacity-50">Maria Silva</span>
                <span className="text-[10px] uppercase font-black opacity-50">12/28</span>
              </div>
            </div>
            <button className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#802D44] transition-all">+ Novo Cartão</button>
          </div>
        );
      default:
        return (
          <div className="space-y-2 animate-in fade-in duration-300">
            <h3 className="text-xl font-black uppercase italic text-[#394158] mb-6 px-4">Configurações</h3>
            <button onClick={() => setSecaoConfig('conta')} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl hover:bg-gray-50 transition-all border border-gray-50 group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#802D44]/10 text-[#802D44] rounded-xl"><Lock size={20}/></div>
                <span className="font-bold text-sm">Conta e Segurança</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#802D44]" />
            </button>
            <button onClick={() => setSecaoConfig('enderecos')} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl hover:bg-gray-50 transition-all border border-gray-50 group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#802D44]/10 text-[#802D44] rounded-xl"><MapPin size={20}/></div>
                <span className="font-bold text-sm">Meus Endereços</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#802D44]" />
            </button>
            <button onClick={() => setSecaoConfig('cartoes')} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl hover:bg-gray-50 transition-all border border-gray-50 group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#802D44]/10 text-[#802D44] rounded-xl"><CreditCard size={20}/></div>
                <span className="font-bold text-sm">Contas Bancárias / Cartões</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#802D44]" />
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] font-sans pb-20">
      
      {/* HEADER DINÂMICO */}
      <header className="w-full bg-white py-6 px-8 border-b border-gray-100 flex justify-center sticky top-0 z-50">
        <div className="w-full max-w-4xl flex justify-between items-center">
          {telaAtual === 'perfil' ? (
            <button onClick={() => navigate('/home2')} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">← Loja</button>
          ) : (
            <button onClick={() => {setTelaAtual('perfil'); setSecaoConfig('menu');}} className="text-[10px] font-black uppercase tracking-widest text-[#802D44]">← Voltar</button>
          )}
          
          <h2 className="text-lg font-black uppercase italic tracking-tighter">
            {telaAtual === 'perfil' ? 'Meu Perfil' : 'Ajustes'}
          </h2>

          <div className="flex items-center gap-4">
            {telaAtual === 'perfil' && (
              <button onClick={() => setTelaAtual('configuracoes')} className="text-[#394158] hover:rotate-90 transition-all duration-500">
                <Settings size={22} />
              </button>
            )}
            <button onClick={() => navigate('/')} className="text-red-500"><LogOut size={20} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-10">
        {telaAtual === 'configuracoes' ? (
          renderConfiguracoes()
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* CARD DE IDENTIDADE */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/50 mb-6 flex items-center gap-6 border border-gray-50">
              <div className="relative">
                <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=200" className="w-20 h-20 rounded-full object-cover border-4 border-[#F5F2ED]" alt="User"/>
                <div className="absolute -bottom-1 -right-1 bg-[#802D44] text-white p-1.5 rounded-full shadow-lg"><Camera size={12} /></div>
              </div>
              <div>
                <h3 className="text-xl font-black italic uppercase leading-tight">Maria Silva</h3>
                <span className="text-[9px] font-black uppercase text-[#55833d] bg-[#55833d]/10 px-2 py-0.5 rounded-full">Conta Verificada</span>
              </div>
            </div>

            {/* SEÇÃO: MINHAS COMPRAS (IGUAL SHOPEE) */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 mb-6 border border-gray-50">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-xs font-black uppercase tracking-widest">Minhas Compras</h4>
                <button className="text-[9px] font-black uppercase text-gray-400">Ver tudo <ChevronRight size={12} /></button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[{i: Wallet, t: 'A Pagar'}, {i: Package, t: 'Preparando'}, {i: Truck, t: 'A Caminho'}, {i: CheckSquare, t: 'Avaliar'}].map((item) => (
                  <div key={item.t} className="flex flex-col items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#802D44]/10 group-hover:text-[#802D44] transition-all"><item.i size={24} /></div>
                    <span className="text-[10px] font-bold uppercase text-center">{item.t}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEÇÃO: MAIS ATIVIDADES */}
            <section className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-gray-200/50 border border-gray-50">
              <div className="px-4 py-4"><h4 className="text-xs font-black uppercase tracking-widest text-[#394158]">Mais Atividades</h4></div>
              <div className="flex flex-col">
                {[{i: Heart, t: 'Meus Favoritos'}, {i: History, t: 'Visto Recentemente'}, {i: RotateCcw, t: 'Comprar Novamente'}, {i: HelpCircle, t: 'Central de Ajuda'}].map((item, idx) => (
                  <React.Fragment key={item.t}>
                    <button className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="text-[#802D44]"><item.i size={20} /></div>
                        <span className="text-sm font-bold">{item.t}</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-[#802D44]" />
                    </button>
                    {idx < 3 && <div className="h-[1px] bg-gray-50 mx-4"></div>}
                  </React.Fragment>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}