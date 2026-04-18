import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Trash2, Minus, Plus, MapPin, 
  Truck, Store, ChevronRight, ShoppingBag, CreditCard, Barcode, Landmark, ArrowLeft
} from 'lucide-react';

const PRODUTOS_DATA = [
  { id: 1, nome: 'Tomate Cereja Orgânico', preco: 8.90, un: 'kg', img: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=400&q=80' },
  { id: 2, nome: 'Ovos Caipira (Dúzia)', preco: 14.50, un: 'un', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80' },
];

export default function Carrinho() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [itens, setItens] = useState<any[]>([]);
  const [cep, setCep] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [metodoPagamento, setMetodoPagamento] = useState<'CARTAO' | 'PIX' | 'BOLETO'>('CARTAO');
  const [valorFrete, setValorFrete] = useState(0);

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho_itens');
    if (carrinhoSalvo) {
      const idsNoCarrinho = JSON.parse(carrinhoSalvo);
      const produtosCompletos = idsNoCarrinho.map((id: number) => {
        const produtoBase = PRODUTOS_DATA.find(p => p.id === id);
        return produtoBase ? { ...produtoBase, quantidade: 1 } : null;
      }).filter((p: any) => p !== null);
      setItens(produtosCompletos);
    }
  }, []);

  const atualizarQtd = (id: number, delta: number) => {
    setItens(prev => prev.map(item => 
      item.id === id ? { ...item, quantidade: Math.max(1, item.quantidade + delta) } : item
    ));
  };

  const removerProduto = (id: number) => {
    const novosItens = itens.filter(item => item.id !== id);
    setItens(novosItens);
    const novosIds = novosItens.map(item => item.id);
    localStorage.setItem('carrinho_itens', JSON.stringify(novosIds));
    localStorage.setItem('carrinho_count', novosIds.length.toString());
    window.dispatchEvent(new Event('storage'));
  };

  const calcularFrete = () => { if (cep.length === 8) setValorFrete(12.90); };
  const subtotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const total = metodoEntrega === 'entrega' ? subtotal + valorFrete : subtotal;

  const handleFinalizarTudo = () => {
    alert("Pedido enviado para o banco de dados conforme as tabelas SQL!");
    localStorage.removeItem('carrinho_itens');
    localStorage.setItem('carrinho_count', '0');
    window.dispatchEvent(new Event('storage'));
    navigate('/home2');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4 font-sans text-[#394158]">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        
        <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-white">
          <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            {step === 1 ? <X size={24} /> : <ArrowLeft size={24} />}
          </button>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">
            {step === 1 ? `Minha Cesta (${itens.length})` : "Pagamento e Revisão"}
          </h2>
          <div className="w-10"></div>
        </header>

        <div className="p-8 space-y-8 max-h-[500px] overflow-y-auto no-scrollbar">
          
          {/* ETAPA 1: CESTA E ESCOLHA DE ENTREGA */}
          {step === 1 && (
            <>
              <div className="space-y-6">
                {itens.length > 0 ? itens.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.img} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm">{item.nome}</h3>
                        <button onClick={() => removerProduto(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-100 rounded-lg px-2 py-1 gap-3">
                          <button onClick={() => atualizarQtd(item.id, -1)}><Minus size={12} /></button>
                          <span className="text-xs font-black">{item.quantidade}</span>
                          <button onClick={() => atualizarQtd(item.id, 1)}><Plus size={12} /></button>
                        </div>
                        <span className="font-black text-sm">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )) : <div className="text-center py-10 opacity-30 font-black uppercase italic">Cesta Vazia</div>}
              </div>

              {itens.length > 0 && (
                <div className="pt-8 border-t border-gray-50 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Opções de envio</h4>
                  <div className="flex gap-3">
                    <button onClick={() => setMetodoEntrega('entrega')} className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${metodoEntrega === 'entrega' ? 'border-[#55833d] bg-white' : 'border-transparent bg-gray-50 opacity-50'}`}>
                      <Truck size={20} /> <span className="text-[10px] font-black">Entrega</span>
                    </button>
                    <button onClick={() => setMetodoEntrega('retirada')} className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${metodoEntrega === 'retirada' ? 'border-[#55833d] bg-white' : 'border-transparent bg-gray-50 opacity-50'}`}>
                      <Store size={20} /> <span className="text-[10px] font-black">Retirada</span>
                    </button>
                  </div>
                  {metodoEntrega === 'entrega' ? (
                    <div className="flex gap-2">
                      <input type="text" placeholder="Seu CEP" value={cep} onChange={(e) => setCep(e.target.value)} className="flex-1 p-4 rounded-xl bg-gray-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-[#55833d]/20" />
                      <button onClick={calcularFrete} className="bg-[#394158] text-white px-6 rounded-xl text-[10px] font-black uppercase">Calcular</button>
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-50 rounded-2xl flex gap-3 items-center border border-orange-100">
                      <MapPin size={18} className="text-[#f9943b]" />
                      <p className="text-[10px] font-bold text-[#f9943b] uppercase">Retirada: Mercado Central, Aracaju/SE</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ETAPA 2: REVISÃO DOS PRODUTOS E PAGAMENTO */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              
              {/* LISTA DE PRODUTOS PARA REVISÃO (PEDIDO DO USUÁRIO) */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-2">Itens do Pedido</h4>
                <div className="grid grid-cols-1 gap-4">
                  {itens.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <img src={item.img} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="text-[11px] font-bold leading-tight">{item.nome}</p>
                          <p className="text-[9px] font-black opacity-40 uppercase">{item.quantidade}x R$ {item.preco.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo do Envio */}
              <div className="bg-[#394158] p-6 rounded-[2rem] space-y-3 text-white">
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Resumo do Envio</h4>
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-50">Método:</span>
                  <span className="uppercase italic">{metodoEntrega === 'entrega' ? `Frete (CEP ${cep})` : 'Retirada em Mãos'}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-50">Local:</span>
                  <span className="text-right">{metodoEntrega === 'entrega' ? 'Endereço cadastrado' : 'Mercado Central, Aracaju'}</span>
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Forma de Pagamento</h4>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => setMetodoPagamento('CARTAO')} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${metodoPagamento === 'CARTAO' ? 'border-[#f9943b] bg-white' : 'border-transparent bg-gray-50'}`}>
                    <CreditCard className={metodoPagamento === 'CARTAO' ? 'text-[#f9943b]' : ''} />
                    <span className="text-xs font-black uppercase tracking-widest">Cartão de Crédito</span>
                  </button>
                  <button onClick={() => setMetodoPagamento('PIX')} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${metodoPagamento === 'PIX' ? 'border-[#f9943b] bg-white' : 'border-transparent bg-gray-50'}`}>
                    <Landmark className={metodoPagamento === 'PIX' ? 'text-[#f9943b]' : ''} />
                    <span className="text-xs font-black uppercase tracking-widest">PIX (Aprovação imediata)</span>
                  </button>
                  <button onClick={() => setMetodoPagamento('BOLETO')} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${metodoPagamento === 'BOLETO' ? 'border-[#f9943b] bg-white' : 'border-transparent bg-gray-50'}`}>
                    <Barcode className={metodoPagamento === 'BOLETO' ? 'text-[#f9943b]' : ''} />
                    <span className="text-xs font-black uppercase tracking-widest">Boleto Bancário</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {itens.length > 0 && (
          <footer className="p-8 border-t border-gray-50 space-y-6 bg-white">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold opacity-40 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {metodoEntrega === 'entrega' && (
                <div className="flex justify-between text-xs font-bold opacity-40 uppercase tracking-widest">
                  <span>Frete</span>
                  <span>R$ {valorFrete.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-4">
                <span className="text-lg font-black uppercase italic tracking-tighter text-gray-400">Total</span>
                <span className="text-2xl font-black text-[#55833d]">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {step === 1 ? (
              <button 
                onClick={() => setStep(2)}
                disabled={metodoEntrega === 'entrega' && valorFrete === 0}
                className="w-full bg-[#394158] hover:bg-[#55833d] disabled:opacity-30 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl"
              >
                Avançar para Pagamento <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleFinalizarTudo}
                className="w-full bg-[#55833d] hover:bg-[#394158] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-900/20"
              >
                Finalizar Compra <ShoppingBag size={18} />
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}