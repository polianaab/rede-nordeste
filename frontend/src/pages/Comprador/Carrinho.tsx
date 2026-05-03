import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Trash2, Minus, Plus, Truck, Store, ChevronRight, 
  ShoppingBag, CreditCard, Barcode, Landmark, ArrowLeft, MapPin, 
  PlusCircle, CheckCircle, Copy, QrCode, Edit2, Phone, Info
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [metodoEntrega, setMetodoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [metodoPagamento, setMetodoPagamento] = useState<'CARTAO' | 'PIX' | 'BOLETO'>('CARTAO');
  const [valorFrete, setValorFrete] = useState(0);
  
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(0);
  const [gerenciarEnderecos, setGerenciarEnderecos] = useState(false);
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [editandoIdx, setEditandoIdx] = useState<number | null>(null);
  const [meusEnderecos, setMeusEnderecos] = useState<any[]>(() => {
    const saved = localStorage.getItem('meus_enderecos');
    return saved ? JSON.parse(saved) : [
      { destinatario: 'Maria Silva', rua: 'Rua das Palmeiras', numero: '450', bairro: 'Atalaia', estadoCidade: 'Sergipe - Aracaju', cep: '49000-000', telefone: '(79) 99999-0000', pontoReferencia: '' }
    ];
  });

  const [formEndereco, setFormEndereco] = useState({
    destinatario: '', cep: '', rua: '', numero: '', bairro: '', estadoCidade: '', telefone: '', pontoReferencia: ''
  });

  const [cartaoSelecionado, setCartaoSelecionado] = useState<number | null>(null);
  const [exibirFormNovoCartao, setExibirFormNovoCartao] = useState(false);
  const [meusCartoes, setMeusCartoes] = useState<any[]>(() => {
    const saved = localStorage.getItem('meus_cartoes');
    return saved ? JSON.parse(saved) : [{ id: 1, final: '4452', titular: 'MARIA SILVA', validade: '12/28' }];
  });
  const [novoCartao, setNovoCartao] = useState({ numero: '', titular: '', validade: '', cvv: '' });

  // Segurança para não sumir itens
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
      } catch (e) { console.error(e); }
    }
    setIsLoaded(true);
  }, []);

  // Sincronização Global (Home e Perfil)
  useEffect(() => {
    if (!isLoaded) return;
    const simplified = itens.map(i => ({ id: i.id, quantidade: i.quantidade, selecionado: i.selecionado }));
    localStorage.setItem('carrinho_itens', JSON.stringify(simplified));
    const totalCount = itens.reduce((acc, curr) => acc + curr.quantidade, 0);
    localStorage.setItem('carrinho_count', totalCount.toString());
    window.dispatchEvent(new Event('storage'));
  }, [itens, isLoaded]);

  useEffect(() => { localStorage.setItem('meus_enderecos', JSON.stringify(meusEnderecos)); }, [meusEnderecos]);
  useEffect(() => { localStorage.setItem('meus_cartoes', JSON.stringify(meusCartoes)); }, [meusCartoes]);

  // Frete Automático
  useEffect(() => {
    if (metodoEntrega === 'entrega' && meusEnderecos[enderecoSelecionado]) {
      const cepAtual = meusEnderecos[enderecoSelecionado].cep || "";
      setValorFrete(cepAtual.startsWith('49') ? 12.50 : 28.90);
    } else { setValorFrete(0); }
  }, [enderecoSelecionado, meusEnderecos, metodoEntrega]);

  const salvarEndereco = () => {
    if (!formEndereco.rua || !formEndereco.numero || !formEndereco.cep || !formEndereco.telefone) {
        alert("Preencha Destinatário, Rua, Número, CEP e Telefone"); return;
    }
    if (editandoIdx !== null) {
      const novos = [...meusEnderecos]; novos[editandoIdx] = formEndereco; setMeusEnderecos(novos);
    } else {
      const novos = [...meusEnderecos, formEndereco]; setMeusEnderecos(novos); setEnderecoSelecionado(novos.length - 1);
    }
    setExibirFormulario(false); setGerenciarEnderecos(false);
  };

  const subtotal = itens.reduce((acc, item) => item.selecionado ? acc + (item.preco * item.quantidade) : acc, 0);
  const total = metodoEntrega === 'entrega' ? subtotal + valorFrete : subtotal;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4 font-sans text-[#394158]">
      <div className="bg-white w-full max-w-lg rounded-[1rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        
        <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-white">
          <button onClick={() => {
            if (exibirFormulario) setExibirFormulario(false);
            else if (gerenciarEnderecos) setGerenciarEnderecos(false);
            else if (step > 1) setStep(step - 1);
            else navigate(-1);
          }} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            {step === 1 && !gerenciarEnderecos && !exibirFormulario ? <X size={24} /> : <ArrowLeft size={24} />}
          </button>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">
            {exibirFormulario ? "Endereço" : gerenciarEnderecos ? "Meus Endereços" : step === 1 ? "Minha Cesta" : step === 2 ? "Logística" : "Pagamento"}
          </h2>
          <div className="w-10"></div>
        </header>

        <div className="p-8 space-y-6 max-h-[550px] overflow-y-auto no-scrollbar">
          
          {/* PASSO 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              {itens.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <input type="checkbox" checked={item.selecionado} onChange={() => setItens(itens.map(i => i.id === item.id ? {...i, selecionado: !i.selecionado} : i))} className="w-5 h-5 text-[#f9943b] rounded-[0.3rem] focus:ring-[#f9943b] cursor-pointer" />
                  <img src={item.img} className="w-16 h-16 rounded-[1rem] object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between font-bold text-sm">
                      <h3>{item.nome}</h3>
                      <button onClick={() => setItens(itens.filter(i => i.id !== item.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                       <div className="flex items-center border rounded-[0.5rem] px-2 py-1 gap-3">
                         <button onClick={() => setItens(itens.map(i => i.id === item.id ? {...i, quantidade: Math.max(1, i.quantidade - 1)} : i))}><Minus size={10} /></button>
                         <span className="text-xs font-black">{item.quantidade}</span>
                         <button onClick={() => setItens(itens.map(i => i.id === item.id ? {...i, quantidade: i.quantidade + 1} : i))}><Plus size={10} /></button>
                       </div>
                       <span className="font-black text-sm">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PASSO 2: LOGÍSTICA */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              {!gerenciarEnderecos && !exibirFormulario ? (
                <>
                  {/* Toggle Entrega/Retirada */}
                  <div className="flex gap-3">
                    <button onClick={() => setMetodoEntrega('entrega')} className={`flex-1 p-4 rounded-[1rem] border-2 flex flex-col items-center gap-2 transition-all ${metodoEntrega === 'entrega' ? 'border-[#f9943b] bg-white shadow-md' : 'border-transparent bg-gray-50 opacity-50'}`}>
                      <Truck size={20} /> <span className="text-[10px] font-black uppercase">Entrega</span>
                    </button>
                    <button onClick={() => setMetodoEntrega('retirada')} className={`flex-1 p-4 rounded-[1rem] border-2 flex flex-col items-center gap-2 transition-all ${metodoEntrega === 'retirada' ? 'border-[#f9943b] bg-white shadow-md' : 'border-transparent bg-gray-50 opacity-50'}`}>
                      <Store size={20} /> <span className="text-[10px] font-black uppercase">Retirada</span>
                    </button>
                  </div>

                  {/* Detalhes conforme escolha */}
                  {metodoEntrega === 'entrega' ? (
                    <div className="space-y-4 animate-in fade-in">
                      <div onClick={() => setGerenciarEnderecos(true)} className="p-5 border-2 border-[#f9943b] rounded-[1rem] bg-white cursor-pointer hover:bg-orange-50 transition-all flex justify-between items-center shadow-sm">
                        <div className="flex gap-3">
                          <MapPin className="text-[#f9943b]" size={22} />
                          <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Entregar em:</p>
                          <p className="text-sm font-bold">{meusEnderecos[enderecoSelecionado]?.rua}, {meusEnderecos[enderecoSelecionado]?.numero}</p>
                          <p className="text-[10px] opacity-60 font-medium">{meusEnderecos[enderecoSelecionado]?.bairro} • {meusEnderecos[enderecoSelecionado]?.cep}</p>
                          {meusEnderecos[enderecoSelecionado]?.pontoReferencia && <p className="text-[9px] text-[#f9943b] italic mt-1 font-bold flex items-center gap-1"><Info size={10}/> {meusEnderecos[enderecoSelecionado].pontoReferencia}</p>}</div>
                        </div>
                        <ChevronRight className="text-[#f9943b]" size={20} />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-white rounded-[1rem] border-2 border-[#f9943b] flex gap-4 animate-in fade-in shadow-sm">
                      <div className="bg-orange-50 p-3 rounded-[0.8rem] text-[#f9943b]">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Local de Retirada:</p>
                        <p className="text-sm font-bold">{itens[0]?.localizacao.split('-')[0] || "Endereço do Vendedor"}</p>
                        <p className="text-[10px] opacity-60 font-medium italic">{itens[0]?.localizacao.split('-')[1] || "Aracaju - Sergipe"}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : exibirFormulario ? (
                /* Formulário Novo/Editar */
                <div className="space-y-4 animate-in zoom-in-95">
                  <input type="text" placeholder="Quem recebe?" value={formEndereco.destinatario} onChange={e => setFormEndereco({...formEndereco, destinatario: e.target.value})} className="w-full p-4 bg-gray-50 rounded-[1rem] outline-none border" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="CEP" value={formEndereco.cep} onChange={e => setFormEndereco({...formEndereco, cep: e.target.value.replace(/\D/g, '')})} maxLength={8} className="flex-1 p-4 bg-gray-50 rounded-[1rem] outline-none border" />
                    <input type="text" placeholder="Nº" value={formEndereco.numero} onChange={e => setFormEndereco({...formEndereco, numero: e.target.value})} className="w-24 p-4 bg-gray-50 rounded-[1rem] outline-none border" />
                  </div>
                  <input type="text" placeholder="Rua / Avenida" value={formEndereco.rua} onChange={e => setFormEndereco({...formEndereco, rua: e.target.value})} className="w-full p-4 bg-gray-50 rounded-[1rem] outline-none border" />
                  <input type="text" placeholder="Bairro" value={formEndereco.bairro} onChange={e => setFormEndereco({...formEndereco, bairro: e.target.value})} className="w-full p-4 bg-gray-50 rounded-[1rem] outline-none border" />
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-5 text-gray-400"/>
                    <input type="text" placeholder="Telefone" value={formEndereco.telefone} onChange={e => setFormEndereco({...formEndereco, telefone: e.target.value})} className="w-full p-4 bg-gray-50 rounded-[1rem] outline-none border pl-10" />
                  </div>
                  <input type="text" placeholder="Ponto de Referência" value={formEndereco.pontoReferencia} onChange={e => setFormEndereco({...formEndereco, pontoReferencia: e.target.value})} className="w-full p-4 bg-gray-50 rounded-[1rem] outline-none border" />
                  <button onClick={salvarEndereco} className="w-full py-5 bg-[#f9943b] text-white rounded-[1rem] font-black uppercase text-xs shadow-lg mt-4 active:scale-95 transition-all">Confirmar Endereço</button>
                </div>
              ) : (
                /* Lista de Endereços */
                <div className="space-y-3 animate-in fade-in">
                  {meusEnderecos.map((end, idx) => (
                    <div key={idx} className="flex gap-2 group">
                      <button onClick={() => { setEnderecoSelecionado(idx); setGerenciarEnderecos(false); }} className={`flex-1 p-4 rounded-[1rem] border-2 text-left transition-all ${enderecoSelecionado === idx ? 'border-[#f9943b] bg-white shadow-md' : 'border-gray-50 bg-gray-50 opacity-60'}`}>
                        <p className="text-xs font-bold">{end.rua}, {end.numero}</p>
                        <p className="text-[9px] font-bold opacity-40 uppercase">{end.bairro} • {end.cep}</p>
                      </button>
                      <button onClick={() => { setFormEndereco(end); setEditandoIdx(idx); setExibirFormulario(true); }} className="p-4 bg-white border border-gray-100 rounded-[1rem] text-gray-400 hover:text-[#f9943b] shadow-sm"><Edit2 size={16}/></button>
                      <button onClick={() => setMeusEnderecos(meusEnderecos.filter((_, i) => i !== idx))} className="p-4 bg-white border border-gray-100 rounded-[1rem] text-gray-400 hover:text-red-500 shadow-sm"><Trash2 size={16}/></button>
                    </div>
                  ))}
                  <button onClick={() => { setEditandoIdx(null); setFormEndereco({destinatario:'', cep:'', rua:'', numero:'', bairro:'', estadoCidade:'', telefone:'', pontoReferencia:''}); setExibirFormulario(true); }} className="w-full py-5 border-2 border-dashed border-gray-200 rounded-[1rem] text-[10px] font-black uppercase text-gray-400 flex items-center justify-center gap-2 hover:border-[#f9943b] hover:text-[#f9943b] transition-all mt-4"><PlusCircle size={16} /> Cadastrar Novo</button>
                </div>
              )}
            </div>
          )}

          {/* PASSO 3: PAGAMENTO */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              {/* Resumo */}
              <div className="bg-gray-50 rounded-[1rem] p-5 border border-gray-100">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Resumo do Pedido</p>
                <div className="space-y-3">
                  {itens.filter(i => i.selecionado).map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.img} className="w-8 h-8 rounded-[0.5rem] object-cover" />
                        <span className="font-bold">{item.quantidade}x <span className="opacity-60">{item.nome}</span></span>
                      </div>
                      <span className="font-black">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métodos */}
              <div className="grid grid-cols-3 gap-2">
                {['CARTAO', 'PIX', 'BOLETO'].map(m => (
                  <button key={m} onClick={() => setMetodoPagamento(m as any)} className={`p-4 rounded-[1rem] border-2 flex flex-col items-center gap-1 transition-all ${metodoPagamento === m ? 'border-[#f9943b] bg-white shadow-md' : 'border-transparent bg-gray-50 opacity-40'}`}>
                    {m === 'CARTAO' && <CreditCard size={20} />} {m === 'PIX' && <Landmark size={20} />} {m === 'BOLETO' && <Barcode size={20} />}
                    <span className="text-[9px] font-black">{m}</span>
                  </button>
                ))}
              </div>

              {metodoPagamento === 'CARTAO' && (
                <div className="space-y-3">
                  {meusCartoes.map(c => (
                    <button key={c.id} onClick={() => setCartaoSelecionado(c.id)} className={`w-full p-4 rounded-[1rem] border-2 flex justify-between items-center transition-all ${cartaoSelecionado === c.id ? 'border-[#f9943b] bg-white' : 'border-gray-50 bg-gray-50 opacity-70'}`}>
                      <div className="flex items-center gap-3"><CreditCard size={16} className="opacity-40" /><span className="text-xs font-bold">**** {c.final} • {c.titular}</span></div>
                      {cartaoSelecionado === c.id && <CheckCircle className="text-[#f9943b]" size={16} />}
                    </button>
                  ))}
                  {exibirFormNovoCartao ? (
                    <div className="p-5 bg-gray-50 rounded-[1rem] border border-gray-200 space-y-3 animate-in zoom-in-95">
                      <input type="text" placeholder="Número do Cartão" className="w-full p-3 rounded-[0.8rem] text-xs outline-none" onChange={e => setNovoCartao({...novoCartao, numero: e.target.value})} />
                      <input type="text" placeholder="Nome Impresso" className="w-full p-3 rounded-[0.8rem] text-xs outline-none" onChange={e => setNovoCartao({...novoCartao, titular: e.target.value.toUpperCase()})} />
                      <div className="flex gap-2"><input type="text" placeholder="MM/AA" className="flex-1 p-3 rounded-[0.8rem] text-xs" onChange={e => setNovoCartao({...novoCartao, validade: e.target.value})} /><input type="text" placeholder="CVV" className="w-20 p-3 rounded-[0.8rem] text-xs" /></div>
                      <button onClick={() => {
                        const cartao = { id: Date.now(), final: novoCartao.numero.slice(-4), titular: novoCartao.titular, validade: novoCartao.validade };
                        setMeusCartoes([...meusCartoes, cartao]); setCartaoSelecionado(cartao.id); setExibirFormNovoCartao(false);
                      }} className="w-full py-4 bg-[#f9943b] text-white rounded-[1rem] font-black uppercase text-[10px]">Cadastrar e Usar</button>
                    </div>
                  ) : (
                    <button onClick={() => setExibirFormNovoCartao(true)} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[1rem] text-[10px] font-black uppercase text-gray-400 hover:text-[#f9943b] transition-all flex items-center justify-center gap-2"><PlusCircle size={14}/> Outro Cartão</button>
                  )}
                </div>
              )}

              {metodoPagamento === 'PIX' && (
                <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-[1rem] text-center border border-gray-100 animate-in fade-in">
                  <div className="bg-white p-3 rounded-[1rem] shadow-sm border border-gray-50"><QrCode size={130} /></div>
                  <button onClick={() => {navigator.clipboard.writeText('link-exemplo-pix-123'); alert('Copiado!');}} className="flex items-center gap-2 text-xs font-bold text-[#f9943b] hover:scale-105 transition-all"><Copy size={16}/> Copiar Link Pix</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER DINÂMICO */}
        {itens.length > 0 && !exibirFormulario && (
          <footer className="p-8 border-t border-gray-50 bg-white">
            <div className="space-y-2 mb-6">
               {step === 1 ? (
                 <div className="flex justify-between items-baseline pt-2">
                    <span className="text-lg font-black uppercase text-[#394158]">Subtotal</span>
                    <span className="text-2xl font-black text-[#f9943b]">R$ {subtotal.toFixed(2)}</span>
                 </div>
               ) : (
                 <>
                    <div className="flex justify-between text-xs font-bold text-gray-400"><span>Itens</span><span>R$ {subtotal.toFixed(2)}</span></div>
                    {metodoEntrega === 'entrega' && <div className="flex justify-between text-xs font-bold text-gray-400"><span>Entrega</span><span>R$ {valorFrete.toFixed(2)}</span></div>}
                    <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 mt-2">
                        <span className="text-lg font-black uppercase text-[#394158]">Total</span>
                        <span className="text-2xl font-black text-[#f9943b]">R$ {total.toFixed(2)}</span>
                    </div>
                 </>
               )}
            </div>

            <button 
              onClick={() => {
                if (step === 1) {
                    if (itens.filter(i => i.selecionado).length === 0) return alert("Selecione algo!");
                    setStep(2);
                }
                else if (step === 2) setStep(3);
                else { alert("Pedido feito!"); navigate('/home2'); }
              }}
              className="w-full py-6 rounded-[1rem] font-black uppercase text-[10px] bg-[#f9943b] text-white shadow-xl hover:bg-[#e8832a] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {step === 1 ? "Avançar" : step === 2 ? "Pagamento" : `Finalizar R$ ${total.toFixed(2)}`}
              <ChevronRight size={18} />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}