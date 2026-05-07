import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Trash2, Minus, Plus, Truck, Store, ChevronRight,
  ShoppingBag, CreditCard, Barcode, Landmark, ArrowLeft, MapPin, PlusCircle, CheckCircle
} from 'lucide-react';
import {
  getCarrinho, adicionarAoCarrinho, removerDoCarrinho, checkout, simularFrete
} from '../../services/api';

export default function Carrinho() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [carrinho, setCarrinho] = useState<any>({ itens: [], totalItens: 0, valorTotal: 0 });
  const [carregando, setCarregando] = useState(true);
  const [metodoEntrega, setMetodoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [metodoPagamento, setMetodoPagamento] = useState<'CARTAO' | 'PIX' | 'BOLETO'>('CARTAO');
  const [valorFrete, setValorFrete] = useState(0);
  const [processando, setProcessando] = useState(false);

  // Endereços
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(0);
  const [mudarEndereco, setMudarEndereco] = useState(false);
  const [exibirFormNovoEndereco, setExibirFormNovoEndereco] = useState(false);
  const [meusEnderecos, setMeusEnderecos] = useState<any[]>(() => {
    const saved = localStorage.getItem('meus_enderecos');
    return saved ? JSON.parse(saved) : [
      { destinatario: 'Usuário', rua: 'Rua das Palmeiras', numero: '450', bairro: 'Atalaia', estadoCidade: 'Sergipe - Aracaju', cep: '49000-000', latitudeDestino: -10.9850, longitudeDestino: -37.0490 }
    ];
  });
  const [novoEndereco, setNovoEndereco] = useState({ destinatario: '', cep: '', estadoCidade: '', bairro: '', rua: '', numero: '' });

  // ── Carrega carrinho da API ───────────────────────────────────────
  useEffect(() => {
    getCarrinho()
      .then(setCarrinho)
      .catch(() => setCarrinho({ itens: [], totalItens: 0, valorTotal: 0 }))
      .finally(() => setCarregando(false));
  }, []);

  // ── Simula frete quando muda endereço ou modo ─────────────────────
  useEffect(() => {
    if (metodoEntrega !== 'entrega') { setValorFrete(0); return; }
    const end = meusEnderecos[enderecoSelecionado];
    if (!end?.latitudeDestino || carrinho.itens.length === 0) return;

    const lojaId = carrinho.itens[0]?.lojaId;
    if (!lojaId) return;

    simularFrete(lojaId, end.latitudeDestino, end.longitudeDestino)
      .then((data: any) => setValorFrete(Number(data.valorFrete)))
      .catch(() => setValorFrete(0));
  }, [metodoEntrega, enderecoSelecionado, carrinho.itens]);

  const atualizarQtd = async (produtoId: number, novaQtd: number) => {
    if (novaQtd < 1) return;
    try {
      const atualizado = await adicionarAoCarrinho(produtoId, novaQtd);
      setCarrinho(atualizado);
    } catch (err: any) { alert(err.message); }
  };

  const remover = async (produtoId: number) => {
    try {
      const atualizado = await removerDoCarrinho(produtoId);
      setCarrinho(atualizado);
    } catch (err: any) { alert(err.message); }
  };

  const handleFinalizarPedido = async () => {
    if (carrinho.itens.length === 0) { alert('Carrinho vazio!'); return; }
    setProcessando(true);
    try {
      const end = meusEnderecos[enderecoSelecionado];
      await checkout({
        metodoPagamento,
        retiradaNaLoja: metodoEntrega === 'retirada',
        enderecoEntrega: metodoEntrega === 'entrega'
          ? `${end.rua}, ${end.numero} - ${end.bairro}, ${end.estadoCidade}`
          : undefined,
        cidadeDestino: metodoEntrega === 'entrega' ? (end.estadoCidade?.split(' - ')[1] || '') : undefined,
        latitudeDestino: metodoEntrega === 'entrega' ? end.latitudeDestino : undefined,
        longitudeDestino: metodoEntrega === 'entrega' ? end.longitudeDestino : undefined,
      });
      alert('Pedido realizado com sucesso!');
      setCarrinho({ itens: [], totalItens: 0, valorTotal: 0 });
      navigate('/perfil');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessando(false);
    }
  };

  const subtotal = Number(carrinho.valorTotal);
  const total = metodoEntrega === 'entrega' ? subtotal + valorFrete : subtotal;

  if (carregando) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase text-sm opacity-30">
      Carregando carrinho...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4 font-sans text-[#394158]">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">

        <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-white">
          <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="p-2 hover:bg-gray-100 rounded-full">
            {step === 1 ? <X size={24} /> : <ArrowLeft size={24} />}
          </button>
          <h2 className="text-lg font-black uppercase italic tracking-tighter">
            {step === 1 ? `Minha Cesta (${carrinho.totalItens})` : 'Pagamento e Revisão'}
          </h2>
          <div className="w-10" />
        </header>

        <div className="p-8 space-y-8 max-h-[500px] overflow-y-auto no-scrollbar">
          {step === 1 && (
            <>
              <div className="space-y-6">
                {carrinho.itens.length > 0 ? carrinho.itens.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.imagemUrl || 'https://via.placeholder.com/100'}
                      className="w-16 h-16 rounded-2xl object-cover" alt="" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm">{item.nomeProduto}</h3>
                        <button onClick={() => remover(item.produtoId)} className="text-gray-300 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-100 rounded-lg px-2 py-1 gap-3">
                          <button onClick={() => atualizarQtd(item.produtoId, item.quantidade - 1)}
                            className="hover:text-[#55833d]"><Minus size={12} /></button>
                          <span className="text-xs font-black">{item.quantidade}</span>
                          <button onClick={() => atualizarQtd(item.produtoId, item.quantidade + 1)}
                            className="hover:text-[#55833d]"><Plus size={12} /></button>
                        </div>
                        <span className="font-black text-sm">R$ {Number(item.subtotal).toFixed(2)}</span>
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

              {carrinho.itens.length > 0 && (
                <div className="pt-8 border-t border-gray-50 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Opções de envio</h4>
                  <div className="flex gap-3">
                    <button onClick={() => setMetodoEntrega('entrega')}
                      className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${metodoEntrega === 'entrega' ? 'border-[#55833d] bg-white shadow-md' : 'border-transparent bg-gray-50 opacity-50'}`}>
                      <Truck size={20} /><span className="text-[10px] font-black">Entrega</span>
                    </button>
                    <button onClick={() => setMetodoEntrega('retirada')}
                      className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${metodoEntrega === 'retirada' ? 'border-[#55833d] bg-white shadow-md' : 'border-transparent bg-gray-50 opacity-50'}`}>
                      <Store size={20} /><span className="text-[10px] font-black">Retirada</span>
                    </button>
                  </div>

                  {metodoEntrega === 'entrega' && (
                    <div className="bg-gray-50 p-4 rounded-2xl animate-in fade-in">
                      <p className="text-[9px] font-black uppercase opacity-50 mb-2">Frete calculado para o endereço selecionado</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{meusEnderecos[enderecoSelecionado]?.rua}, {meusEnderecos[enderecoSelecionado]?.numero}</span>
                        <span className="font-black text-[#55833d]">{valorFrete > 0 ? `R$ ${valorFrete.toFixed(2)}` : 'Calculando...'}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              {/* Resumo */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resumo da Compra</h4>
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  {carrinho.itens.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.imagemUrl || 'https://via.placeholder.com/100'}
                        className="w-12 h-12 rounded-xl object-cover" alt={item.nomeProduto} />
                      <div className="flex-1">
                        <p className="text-xs font-bold leading-tight">{item.nomeProduto}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{item.quantidade}x R$ {Number(item.precoUnitario).toFixed(2)}</p>
                      </div>
                      <span className="text-xs font-black text-[#55833d]">R$ {Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Endereço */}
              {metodoEntrega === 'entrega' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Endereço de Entrega</h4>
                    {!exibirFormNovoEndereco && (
                      <button onClick={() => setMudarEndereco(!mudarEndereco)} className="text-[10px] font-black uppercase text-[#55833d] hover:underline">
                        {mudarEndereco ? 'Fechar' : 'Mudar'}
                      </button>
                    )}
                  </div>

                  {mudarEndereco ? (
                    <div className="space-y-3">
                      {meusEnderecos.map((end, idx) => (
                        <button key={idx} onClick={() => { setEnderecoSelecionado(idx); setMudarEndereco(false); }}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex gap-3 items-center ${enderecoSelecionado === idx ? 'border-[#55833d] bg-white' : 'border-transparent bg-gray-50 opacity-60'}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${enderecoSelecionado === idx ? 'border-[#55833d]' : 'border-gray-300'}`}>
                            {enderecoSelecionado === idx && <div className="w-2 h-2 bg-[#55833d] rounded-full" />}
                          </div>
                          <p className="text-[11px] font-bold flex-1">{end.rua}, {end.numero} - {end.bairro}</p>
                        </button>
                      ))}
                      <button onClick={() => setExibirFormNovoEndereco(true)}
                        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-[#55833d]">
                        <PlusCircle size={14} /> Novo endereço
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 bg-white rounded-3xl border-2 border-[#55833d] flex gap-4 items-center">
                      <div className="p-3 bg-[#55833d]/10 rounded-2xl text-[#55833d]"><MapPin size={20} /></div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black uppercase text-[#55833d]">Entregar em:</p>
                        <p className="text-sm font-bold">{meusEnderecos[enderecoSelecionado]?.rua}, {meusEnderecos[enderecoSelecionado]?.numero}</p>
                        <p className="text-[10px] opacity-50 font-bold">{meusEnderecos[enderecoSelecionado]?.bairro} - {meusEnderecos[enderecoSelecionado]?.estadoCidade}</p>
                      </div>
                      <CheckCircle size={18} className="text-[#55833d]" />
                    </div>
                  )}
                </div>
              )}

              {/* Pagamento */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Forma de Pagamento</h4>
                <div className="grid grid-cols-1 gap-3">
                  {['CARTAO', 'PIX', 'BOLETO'].map(m => (
                    <button key={m} onClick={() => setMetodoPagamento(m as any)}
                      className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${metodoPagamento === m ? 'border-[#f9943b] bg-white shadow-lg' : 'border-transparent bg-gray-50 opacity-60'}`}>
                      {m === 'CARTAO' && <CreditCard className={metodoPagamento === 'CARTAO' ? 'text-[#f9943b]' : ''} />}
                      {m === 'PIX' && <Landmark className={metodoPagamento === 'PIX' ? 'text-[#f9943b]' : ''} />}
                      {m === 'BOLETO' && <Barcode className={metodoPagamento === 'BOLETO' ? 'text-[#f9943b]' : ''} />}
                      <span className="text-xs font-black uppercase tracking-widest">
                        {m === 'CARTAO' ? 'Cartão de Crédito' : m === 'PIX' ? 'Pix (Aprovação Instantânea)' : 'Boleto'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {carrinho.itens.length > 0 && (
          <footer className="p-8 border-t border-gray-50 bg-white">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-400">
                <span>Frete</span>
                <span>{metodoEntrega === 'entrega' ? `R$ ${valorFrete.toFixed(2)}` : 'Grátis'}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                <span className="text-lg font-black uppercase">Total</span>
                <span className="text-2xl font-black text-[#55833d]">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => step === 1 ? setStep(2) : handleFinalizarPedido()}
              disabled={processando}
              className={`w-full py-6 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all ${
                processando ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-[#394158] hover:bg-[#55833d] text-white shadow-xl active:scale-95'
              }`}>
              {processando ? 'Processando...'
                : step === 1 ? 'Avançar para Pagamento'
                : `Pagar R$ ${total.toFixed(2)}`}
              {!processando && <ChevronRight size={18} />}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}