import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Trash2, Minus, Plus, Truck, Store, ChevronRight, 
  ShoppingBag, CreditCard, Barcode, Landmark, ArrowLeft, MapPin, PlusCircle, CheckCircle
} from 'lucide-react';

const PRODUTOS_DATA = [
  { id: 1, nome: 'Tomate Cereja Orgânico', preco: 8.90, un: 'kg', img: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/beirario/media/uploads/produtos/foto/b3fd841dfd2c3file.png', localizacao: 'Sítio Alvorada, SE - Rua das Flores, 12' },
  { id: 2, nome: 'Ovos Caipira (Dúzia)', preco: 14.50, un: 'un', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80', localizacao: 'Granja Girassol, BA - Estrada Velha, S/N' },
  { id: 3, nome: 'Café Especial 500g', preco: 28.90, un: 'un', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80', localizacao: 'Baturité, CE - Bairro Centro, 45' },
  { id: 4, nome: 'Cesto de Palha', preco: 120.00, un: 'un', img: 'https://img.elo7.com.br/product/zoom/3996150/cesto-de-palha-com-alca-40cm-cesto-de-palha.jpg', localizacao: 'Ilha do Ferro, AL - Rua da Palha, 02' },
  { id: 5, nome: 'Queijo Coalho Tradicional', preco: 38.00, un: 'kg', img: 'https://api.ootimista.com.br/wp-content/uploads/2023/02/queijo-coalho-embrapa.jpg', localizacao: 'Glória, SE - Alto da Glória, 100' },
  { id: 6, nome: 'Carne Seca', preco: 38.00, un: 'kg', img: 'https://revistamaiscarne.com.br/wp-content/uploads/2024/05/Brasileirissima-a-Carne-Seca-segue-conquistando-novos-publicos-2.jpg', localizacao: 'Glória, SE - Mercado Municipal' },
  { id: 7, nome: 'Feijão Verde', preco: 15.00, un: 'kg', img: 'https://receitadaboa.com.br/wp-content/uploads/2024/09/Feijao-verde-nordestino.jpg', localizacao: 'Aracaju, SE - Bairro Industrial, 500' },
  { id: 8, nome: 'Kit: 1 Cobre-leito Bouti de Microfibra Ultrassonic + Porta-Travesseiros ', preco: 179.80, un: 'un', img: 'https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22573-ogxytxlxwt0/pv/82/84/48/813d10430e46dbd0c2bc48f2a5/kit-1-cobre-leito-bouti-de-microfibra-ultrassonic-porta-travesseiros-lais-verde-large-1.png', localizacao: 'Aracaju, SE - Av. Beira Mar, 1200' },
  { id: 9, nome: 'Coxinha Fit de Batata Doce com Frango e Requeijão ', preco: 13, un: 'un', img: 'https://s2-receitas.glbimg.com/7HHi1Zrz6Dxt_G7N09l-NapN8X4=/0x0:1366x768/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2025/v/t/ceFth3Tnu97KDRgekajg/coxinha-de-galinha-com-massa-de-batata.jpg', localizacao: 'Aracaju, SE - Bairro Jardins, 88' },
  { id: 10, nome: 'Conjunto Infantil Menino', preco: 65.90, un: 'un', img: 'https://somoscorujas.cdn.magazord.com.br/img/2025/01/produto/45394/sc19758-1.png?ims=fit-in/400x533/filters:fill(white)', localizacao: 'Aracaju, SE - Centro Comunitário' },
];

export default function Carrinho() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [itens, setItens] = useState<any[]>([]);
  const [cep, setCep] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [metodoPagamento, setMetodoPagamento] = useState<'CARTAO' | 'PIX' | 'BOLETO'>('CARTAO');
  const [valorFrete, setValorFrete] = useState(0);
  
  // Estados para Endereços (Integrados com o Perfil)
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(0);
  const [mudarEndereco, setMudarEndereco] = useState(false);
  const [exibirFormNovoEndereco, setExibirFormNovoEndereco] = useState(false);
  const [meusEnderecos, setMeusEnderecos] = useState<any[]>(() => {
    const saved = localStorage.getItem('meus_enderecos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      { destinatario: 'Maria Silva', rua: 'Rua das Palmeiras', numero: '450', bairro: 'Atalaia', estadoCidade: 'Sergipe - Aracaju', cep: '49000-000', principal: true },
      { destinatario: 'Maria Silva', rua: 'Av. Hermes Fontes', numero: '120', bairro: 'Suissa', estadoCidade: 'Sergipe - Aracaju', cep: '49000-100', principal: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('meus_enderecos', JSON.stringify(meusEnderecos));
  }, [meusEnderecos]);

  useEffect(() => {
    if (meusEnderecos.length > 0 && !meusEnderecos[enderecoSelecionado]) {
      setEnderecoSelecionado(0);
    }
  }, [meusEnderecos, enderecoSelecionado]);

  const [novoEndereco, setNovoEndereco] = useState({
    destinatario: '', telefone: '', cep: '', estadoCidade: '', bairro: '', rua: '', numero: '', complemento: ''
  });

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho_itens');
    if (carrinhoSalvo) {
      try {
        const dadosSalvos = JSON.parse(carrinhoSalvo);
        const produtosCompletos = dadosSalvos.map((itemSalvo: any) => {
          const produtoBase = PRODUTOS_DATA.find(p => p.id === itemSalvo.id);
          return produtoBase ? { ...produtoBase, quantidade: itemSalvo.quantidade, selecionado: itemSalvo.selecionado !== false } : null;
        }).filter((p: any) => p !== null);
        setItens(produtosCompletos);
      } catch (e) { console.error("Erro ao carregar carrinho", e); }
    }
  }, []);

  useEffect(() => {
    if (itens.length > 0) {
      const simplified = itens.map(i => ({ id: i.id, quantidade: i.quantidade, selecionado: i.selecionado !== false }));
      localStorage.setItem('carrinho_itens', JSON.stringify(simplified));
      const totalCount = itens.reduce((acc, curr) => acc + curr.quantidade, 0);
      localStorage.setItem('carrinho_count', totalCount.toString());
    }
  }, [itens]);

  useEffect(() => {
    if (cep.length === 8) {
      const novoFrete = cep.startsWith('49') ? 12.50 : 28.90;
      setValorFrete(novoFrete);
    } else {
      setValorFrete(0);
    }
  }, [cep]);

  const atualizarQtd = (id: number, delta: number) => {
    setItens(prev => prev.map(item => 
      item.id === id ? { ...item, quantidade: Math.max(1, item.quantidade + delta) } : item
    ));
    window.dispatchEvent(new Event('storage'));
  };

  const toggleSelecionado = (id: number) => {
    setItens(prev => prev.map(item =>
      item.id === id ? { ...item, selecionado: item.selecionado === false ? true : false } : item
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

  const subtotal = itens.reduce((acc, item) => item.selecionado !== false ? acc + (item.preco * item.quantidade) : acc, 0);
  const total = metodoEntrega === 'entrega' ? subtotal + valorFrete : subtotal;

  const handleFinalizarTudo = () => {
    const itensComprados = itens.filter(item => item.selecionado !== false);
    if (itensComprados.length === 0) {
      alert("Selecione pelo menos um item para comprar!");
      return;
    }
    alert("Pedido finalizado com sucesso!");
    const remainingItens = itens.filter(item => item.selecionado === false);
    setItens(remainingItens);
    const simplified = remainingItens.map(i => ({ id: i.id, quantidade: i.quantidade, selecionado: false }));
    localStorage.setItem('carrinho_itens', JSON.stringify(simplified));
    const totalCount = remainingItens.reduce((acc, curr) => acc + curr.quantidade, 0);
    localStorage.setItem('carrinho_count', totalCount.toString());
    window.dispatchEvent(new Event('storage'));
    navigate('/home2');
  };

  const handleSalvarNovoEndereco = () => {
    if(!novoEndereco.rua || !novoEndereco.cep) return;
    const formatado = { ...novoEndereco, principal: false };
    setMeusEnderecos([...meusEnderecos, formatado]);
    setExibirFormNovoEndereco(false);
    setMudarEndereco(true);
    alert('Novo endereço cadastrado!');
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
                    <div className="flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={item.selecionado !== false} 
                        onChange={() => toggleSelecionado(item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-[#55833d] focus:ring-[#55833d] cursor-pointer"
                      />
                    </div>
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

                  {metodoEntrega === 'entrega' ? (
                    <div className="bg-gray-50 p-4 rounded-2xl space-y-3 animate-in fade-in">
                      <label className="text-[9px] font-black uppercase opacity-50">Informe seu CEP para o frete</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          maxLength={8}
                          value={cep}
                          onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                          placeholder="00000000"
                          className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#55833d]"
                        />
                        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center justify-center min-w-[80px]">
                          <span className="text-xs font-black text-[#55833d]">{valorFrete > 0 ? `R$ ${valorFrete.toFixed(2)}` : '--'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F5F2ED] p-5 rounded-2xl space-y-2 animate-in fade-in">
                      <label className="text-[9px] font-black uppercase opacity-50">Local de Retirada</label>
                      {itens.length > 0 && (
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-[#55833d] mt-1" />
                          <div>
                            <p className="text-xs font-bold">{itens[0].localizacao.split('-')[0]}</p>
                            <p className="text-[10px] opacity-60 leading-tight">{itens[0].localizacao.split('-')[1]}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {step === 2 && (
             <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resumo da Compra</h4>
                 <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                   {itens.filter(i => i.selecionado !== false).map(item => (
                     <div key={item.id} className="flex items-center gap-3">
                       <img src={item.img} className="w-12 h-12 rounded-xl object-cover border border-gray-50" alt={item.nome} />
                       <div className="flex-1">
                         <p className="text-xs font-bold leading-tight text-[#394158]">{item.nome}</p>
                         <p className="text-[10px] text-gray-400 font-bold">{item.quantidade}x R$ {item.preco.toFixed(2)}</p>
                       </div>
                       <span className="text-xs font-black text-[#55833d]">R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                     </div>
                   ))}
                 </div>
               </div>

               {metodoEntrega === 'entrega' && (
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Endereço de Entrega</h4>
                      {!exibirFormNovoEndereco && (
                        <button onClick={() => setMudarEndereco(!mudarEndereco)} className="text-[10px] font-black uppercase text-[#55833d] hover:underline transition-all">
                          {mudarEndereco ? 'Fechar' : 'Mudar'}
                        </button>
                      )}
                    </div>

                    {exibirFormNovoEndereco ? (
                      /* FORMULÁRIO IGUAL AO DO PERFIL */
                      <div className="bg-white rounded-3xl p-6 border-2 border-[#55833d]/20 space-y-4 animate-in zoom-in-95">
                        <div className="grid grid-cols-1 gap-3">
                          <input type="text" placeholder="Nome do Destinatário" className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none" onChange={(e)=>setNovoEndereco({...novoEndereco, destinatario: e.target.value})} />
                          <div className="flex gap-2">
                             <input type="text" placeholder="CEP" className="flex-1 bg-gray-50 p-3 rounded-xl text-sm outline-none" onChange={(e)=>setNovoEndereco({...novoEndereco, cep: e.target.value})} />
                             <input type="text" placeholder="Nº" className="w-20 bg-gray-50 p-3 rounded-xl text-sm outline-none" onChange={(e)=>setNovoEndereco({...novoEndereco, numero: e.target.value})} />
                          </div>
                          <input type="text" placeholder="Rua" className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none" onChange={(e)=>setNovoEndereco({...novoEndereco, rua: e.target.value})} />
                          <input type="text" placeholder="Bairro" className="w-full bg-gray-50 p-3 rounded-xl text-sm outline-none" onChange={(e)=>setNovoEndereco({...novoEndereco, bairro: e.target.value})} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setExibirFormNovoEndereco(false)} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase bg-gray-100">Cancelar</button>
                          <button onClick={handleSalvarNovoEndereco} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase bg-[#55833d] text-white">Salvar</button>
                        </div>
                      </div>
                    ) : mudarEndereco ? (
                      /* LISTA DE ENDEREÇOS COMPLETA */
                      <div className="space-y-3">
                        {meusEnderecos.map((end, idx) => (
                          <button key={idx} onClick={() => {setEnderecoSelecionado(idx); setMudarEndereco(false);}} 
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex gap-3 items-center ${enderecoSelecionado === idx ? 'border-[#55833d] bg-white' : 'border-transparent bg-gray-50 opacity-60'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${enderecoSelecionado === idx ? 'border-[#55833d]' : 'border-gray-300'}`}>
                              {enderecoSelecionado === idx && <div className="w-2 h-2 bg-[#55833d] rounded-full" />}
                            </div>
                            <p className="text-[11px] font-bold flex-1">{end.rua}, {end.numero} - {end.bairro}</p>
                          </button>
                        ))}
                        <button onClick={() => setExibirFormNovoEndereco(true)} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-[#55833d]">
                          <PlusCircle size={14} /> Cadastrar novo endereço
                        </button>
                      </div>
                    ) : meusEnderecos.length > 0 && meusEnderecos[enderecoSelecionado] ? (
                      /* APENAS O ENDEREÇO SELECIONADO (DEFAULT) */
                      <div className="p-5 bg-white rounded-3xl border-2 border-[#55833d] flex gap-4 items-center">
                        <div className="p-3 bg-[#55833d]/10 rounded-2xl text-[#55833d]"><MapPin size={20}/></div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black uppercase text-[#55833d]">Entregar em:</p>
                          <p className="text-sm font-bold leading-tight">{meusEnderecos[enderecoSelecionado].rua}, {meusEnderecos[enderecoSelecionado].numero}</p>
                          <p className="text-[10px] opacity-50 font-bold">{meusEnderecos[enderecoSelecionado].bairro} - {meusEnderecos[enderecoSelecionado].estadoCidade}</p>
                        </div>
                        <CheckCircle size={18} className="text-[#55833d]" />
                      </div>
                    ) : (
                      <div className="p-5 bg-white rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2">
                        <p className="text-[11px] font-bold text-gray-400">Nenhum endereço cadastrado</p>
                        <button onClick={() => setExibirFormNovoEndereco(true)} className="text-[10px] font-black uppercase text-[#55833d] bg-[#55833d]/10 px-4 py-2 rounded-xl hover:bg-[#55833d]/20 transition-all">
                          Cadastrar Agora
                        </button>
                      </div>
                    )}
                 </div>
               )}

               <div className="bg-[#394158] p-6 rounded-[2rem] space-y-4 text-white shadow-xl">
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Logística do Vendedor</h4>
                 <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                    <div className="flex gap-3 items-center">
                      <Truck size={18} className="text-[#f9943b]" />
                      <div>
                        <p className="text-[10px] font-bold opacity-60">Previsão de Chegada</p>
                        <p className="text-xs font-black uppercase italic">Chega entre 14 e 25 de Maio</p>
                      </div>
                    </div>
                 </div>
                 <div className="flex justify-between text-xs font-bold pt-2">
                   <span className="opacity-50">Método:</span>
                   <span className="uppercase italic">{metodoEntrega === 'entrega' ? 'Entrega em domicílio' : 'Retirada em Mãos'}</span>
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Forma de Pagamento</h4>
                 <div className="grid grid-cols-1 gap-3">
                   {['CARTAO', 'PIX', 'BOLETO'].map((m) => (
                     <button key={m} onClick={() => setMetodoPagamento(m as any)} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${metodoPagamento === m ? 'border-[#f9943b] bg-white shadow-lg' : 'border-transparent bg-gray-50 opacity-60'}`}>
                       {m === 'CARTAO' && <CreditCard className={metodoPagamento === 'CARTAO' ? 'text-[#f9943b]' : ''} />}
                       {m === 'PIX' && <Landmark className={metodoPagamento === 'PIX' ? 'text-[#f9943b]' : ''} />}
                       {m === 'BOLETO' && <Barcode className={metodoPagamento === 'BOLETO' ? 'text-[#f9943b]' : ''} />}
                       <span className="text-xs font-black uppercase tracking-widest">{m === 'CARTAO' ? 'Cartão de Crédito' : m === 'PIX' ? 'Pix (Aprovação Instantânea)' : 'Boleto'}</span>
                     </button>
                   ))}
                 </div>
               </div>
             </div>
          )}
        </div>

        {itens.length > 0 && (
          <footer className="p-8 border-t border-gray-50 bg-white">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>Frete</span>
                <span>{metodoEntrega === 'entrega' ? (valorFrete > 0 ? `R$ ${valorFrete.toFixed(2)}` : 'A calcular') : 'Grátis'}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100 mt-4">
                <span className="text-lg font-black uppercase text-[#394158]">Total</span>
                <span className="text-2xl font-black text-[#55833d]">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => step === 1 ? setStep(2) : handleFinalizarTudo()} 
              disabled={metodoEntrega === 'entrega' && step === 1 && cep.length < 8}
              className={`w-full py-6 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all ${
                (metodoEntrega === 'entrega' && step === 1 && cep.length < 8) 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#394158] hover:bg-[#55833d] text-white shadow-xl active:scale-95'
              }`}
            >
              {step === 1 ? "Avançar para Pagamento" : `Pagar R$ ${total.toFixed(2)}`} <ChevronRight size={18} />
            </button>
            {metodoEntrega === 'entrega' && step === 1 && cep.length < 8 && (
              <p className="text-center text-[9px] font-bold text-red-400 mt-3 uppercase tracking-tighter italic">* Insira o CEP para calcular o frete e prosseguir</p>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}