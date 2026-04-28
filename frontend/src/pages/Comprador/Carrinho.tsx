import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Trash2, Minus, Plus, Truck, Store, ChevronRight, 
  ShoppingBag, CreditCard, Barcode, Landmark, ArrowLeft 
} from 'lucide-react';

const PRODUTOS_DATA = [
  { id: 1, nome: 'Tomate Cereja Orgânico', preco: 8.90, un: 'kg', img: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/beirario/media/uploads/produtos/foto/b3fd841dfd2c3file.png' },
  { id: 2, nome: 'Ovos Caipira (Dúzia)', preco: 14.50, un: 'un', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80' },
  { id: 3, nome: 'Café Especial 500g', preco: 28.90, un: 'un', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80' },
  { id: 4, nome: 'Cesto de Palha', preco: 120.00, un: 'un', img: 'https://img.elo7.com.br/product/zoom/3996150/cesto-de-palha-com-alca-40cm-cesto-de-palha.jpg' },
  { id: 5, nome: 'Queijo Coalho Tradicional', preco: 38.00, un: 'kg', img: 'https://api.ootimista.com.br/wp-content/uploads/2023/02/queijo-coalho-embrapa.jpg' },
  { id: 6, nome: 'Carne Seca', preco: 38.00, un: 'kg', img: 'https://revistamaiscarne.com.br/wp-content/uploads/2024/05/Brasileirissima-a-Carne-Seca-segue-conquistando-novos-publicos-2.jpg' },
  { id: 7, nome: 'Feijão Verde', preco: 15.00, un: 'kg', img: 'https://receitadaboa.com.br/wp-content/uploads/2024/09/Feijao-verde-nordestino.jpg' },
];

export default function Carrinho() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [itens, setItens] = useState<any[]>([]);
  const [cep, setCep] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [metodoPagamento, setMetodoPagamento] = useState<'CARTAO' | 'PIX' | 'BOLETO'>('CARTAO');
  const [valorFrete, setValorFrete] = useState(0);

  // CARREGAR ITENS DO LOCALSTORAGE
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho_itens');
    if (carrinhoSalvo) {
      try {
        const dadosSalvos = JSON.parse(carrinhoSalvo);
        // Mapeia os IDs salvos para os dados completos dos produtos
        const produtosCompletos = dadosSalvos.map((itemSalvo: any) => {
          const produtoBase = PRODUTOS_DATA.find(p => p.id === itemSalvo.id);
          return produtoBase ? { ...produtoBase, quantidade: itemSalvo.quantidade } : null;
        }).filter((p: any) => p !== null);
        setItens(produtosCompletos);
      } catch (e) { console.error("Erro ao carregar carrinho", e); }
    }
  }, []);

  // SINCRONIZAR COM LOCAL STORAGE SEMPRE QUE "ITENS" MUDAR
  useEffect(() => {
    if (itens.length > 0) {
      const simplified = itens.map(i => ({ id: i.id, quantidade: i.quantidade }));
      localStorage.setItem('carrinho_itens', JSON.stringify(simplified));
      const totalCount = itens.reduce((acc, curr) => acc + curr.quantidade, 0);
      localStorage.setItem('carrinho_count', totalCount.toString());
    }
  }, [itens]);

  const atualizarQtd = (id: number, delta: number) => {
    setItens(prev => prev.map(item => 
      item.id === id ? { ...item, quantidade: Math.max(1, item.quantidade + delta) } : item
    ));
    window.dispatchEvent(new Event('storage'));
  };

  const removerProduto = (id: number) => {
    const novosItens = itens.filter(item => item.id !== id);
    setItens(novosItens);
    if (novosItens.length === 0) {
      localStorage.setItem('carrinho_itens', '[]');
      localStorage.setItem('carrinho_count', '0');
    }
    window.dispatchEvent(new Event('storage'));
  };

  const subtotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const total = metodoEntrega === 'entrega' ? subtotal + valorFrete : subtotal;

  const handleFinalizarTudo = () => {
    alert("Pedido finalizado com sucesso!");
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
          {step === 1 && (
            <>
              <div className="space-y-6">
                {itens.length > 0 ? itens.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.img} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm">{item.nome}</h3>
                        <button onClick={() => removerProduto(item.id)} className="text-gray-300 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-100 rounded-lg px-2 py-1 gap-3">
                          <button onClick={() => atualizarQtd(item.id, -1)} className="hover:text-[#55833d]"><Minus size={12} /></button>
                          <span className="text-xs font-black">{item.quantidade}</span>
                          <button onClick={() => atualizarQtd(item.id, 1)} className="hover:text-[#55833d]"><Plus size={12} /></button>
                        </div>
                        <span className="font-black text-sm">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 flex flex-col items-center gap-4">
                    <ShoppingBag size={48} className="opacity-10" />
                    <div className="opacity-30 font-black uppercase italic">Cesta Vazia</div>
                  </div>
                )}
              </div>
              {itens.length > 0 && (
                <div className="pt-8 border-t border-gray-50 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Opções de envio</h4>
                  <div className="flex gap-3">
                    <button onClick={() => setMetodoEntrega('entrega')} className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${metodoEntrega === 'entrega' ? 'border-[#55833d] bg-white shadow-md' : 'border-transparent bg-gray-50 opacity-50'}`}>
                      <Truck size={20} /> <span className="text-[10px] font-black">Entrega</span>
                    </button>
                    <button onClick={() => setMetodoEntrega('retirada')} className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${metodoEntrega === 'retirada' ? 'border-[#55833d] bg-white shadow-md' : 'border-transparent bg-gray-50 opacity-50'}`}>
                      <Store size={20} /> <span className="text-[10px] font-black">Retirada</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
             <div className="space-y-8">
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
               
               <div className="bg-[#394158] p-6 rounded-[2rem] space-y-3 text-white">
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Resumo do Envio</h4>
                 <div className="flex justify-between text-xs font-bold">
                   <span className="opacity-50">Método:</span>
                   <span className="uppercase italic">{metodoEntrega === 'entrega' ? 'Entrega em domicílio' : 'Retirada em Mãos'}</span>
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Forma de Pagamento</h4>
                 <div className="grid grid-cols-1 gap-3">
                   {['CARTAO', 'PIX', 'BOLETO'].map((m) => (
                     <button key={m} onClick={() => setMetodoPagamento(m as any)} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${metodoPagamento === m ? 'border-[#f9943b] bg-white shadow-lg' : 'border-transparent bg-gray-50 opacity-60'}`}>
                       {m === 'CARTAO' && <CreditCard />}
                       {m === 'PIX' && <Landmark />}
                       {m === 'BOLETO' && <Barcode />}
                       <span className="text-xs font-black uppercase tracking-widest">{m}</span>
                     </button>
                   ))}
                 </div>
               </div>
             </div>
          )}
        </div>

        {itens.length > 0 && (
          <footer className="p-8 border-t border-gray-50 bg-white">
            <div className="flex justify-between items-baseline pt-4 mb-6">
              <span className="text-lg font-black uppercase text-gray-400">Total</span>
              <span className="text-2xl font-black text-[#55833d]">R$ {total.toFixed(2)}</span>
            </div>
            <button onClick={() => step === 1 ? setStep(2) : handleFinalizarTudo()} className="w-full bg-[#394158] hover:bg-[#55833d] text-white py-6 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3">
              {step === 1 ? "Avançar para Pagamento" : "Finalizar Compra"} <ChevronRight size={18} />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}