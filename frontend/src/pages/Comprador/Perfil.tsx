import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, LogOut, Camera, CheckCircle, 
  Wallet, Package, Truck, CheckSquare,
  Heart, History, RotateCcw, HelpCircle,
  ChevronRight, ShieldCheck, Settings, ArrowLeft,
  MapPin, CreditCard, Lock, ShoppingBag, Calendar, 
  CreditCard as CardIcon, ShoppingCart, Filter, HeartOff, Eye, Trash2, X
} from 'lucide-react';
import { getMeuPerfil, getMeusPedidos } from '../../services/api';

export default function Perfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados de navegação interna
  const [telaAtual, setTelaAtual] = useState<'perfil' | 'configuracoes' | 'compras' | 'detalhe-pedido' | 'rastreio-pedido' | 'favoritos' | 'recentes'>('perfil');
  const [abaAtiva, setAbaAtiva] = useState<'pagar' | 'preparando' | 'caminho' | 'finalizados'>('finalizados');
  const [secaoConfig, setSecaoConfig] = useState<'menu' | 'conta' | 'enderecos' | 'cartoes'>('menu');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null);
  
  // Estados para Endereços
  const [exibirFormEndereco, setExibirFormEndereco] = useState(false);
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
  const [novoEndereco, setNovoEndereco] = useState({
    destinatario: '',
    telefone: '',
    cep: '',
    estadoCidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });

  // Estados para Pagamentos (Cartões)
  const [exibirFormCartao, setExibirFormCartao] = useState(false);
  const [meusCartoes, setMeusCartoes] = useState<any[]>([
    { id: 1, final: '4452', titular: 'MARIA SILVA', validade: '12/28' }
  ]);
  const [novoCartao, setNovoCartao] = useState({
    numero: '',
    titular: '',
    validade: '',
    cvv: ''
  });

  // Dados do Usuário para o Formulário de Conta
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: '', email: '', telefone: '',
  });
  const [pedidos, setPedidos] = useState<any[]>([]);
  
  useEffect(() => {
    getMeuPerfil()
      .then((u: any) => setDadosUsuario({
        nome: u.nomeCompleto,
        email: u.email,
        telefone: u.telefone,
      }))
      .catch(() => {
        // fallback: lê do localStorage
        const raw = localStorage.getItem('usuarioLogado');
        if (raw) {
          const u = JSON.parse(raw);
          setDadosUsuario({ nome: u.nome, email: '', telefone: '' });
        }
      });
  
    getMeusPedidos()
      .then((data: any) => setPedidos(data.content || []))
      .catch(() => setPedidos([]));
  }, []);

  const PRODUTOS_DATA = [
    { id: 1, nome: 'Tomate Cereja Orgânico', preco: 8.90, img: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/beirario/media/uploads/produtos/foto/b3fd841dfd2c3file.png' },
    { id: 2, nome: 'Ovos Caipira (Dúzia)', preco: 14.50, img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80' },
    { id: 3, nome: 'Café Especial 500g', preco: 28.90, img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80' },
    { id: 4, nome: 'Cesto de Palha', preco: 120.00, img: 'https://img.elo7.com.br/product/zoom/3996150/cesto-de-palha-com-alca-40cm-cesto-de-palha.jpg' },
    { id: 5, nome: 'Queijo Coalho Tradicional', preco: 38.00, img: 'https://api.ootimista.com.br/wp-content/uploads/2023/02/queijo-coalho-embrapa.jpg' },
    { id: 6, nome: 'Carne Seca', preco: 38.00, img: 'https://revistamaiscarne.com.br/wp-content/uploads/2024/05/Brasileirissima-a-Carne-Seca-segue-conquistando-novos-publicos-2.jpg' },
    { id: 7, nome: 'Feijão Verde', preco: 15.00, img: 'https://receitadaboa.com.br/wp-content/uploads/2024/09/Feijao-verde-nordestino.jpg' },
    { id: 8, nome: 'Kit: 1 Cobre-leito Bouti de Microfibra Ultrassonic + Porta-Travesseiros ', preco: 179.80, img: 'https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22573-ogxytxlxwt0/pv/82/84/48/813d10430e46dbd0c2bc48f2a5/kit-1-cobre-leito-bouti-de-microfibra-ultrassonic-porta-travesseiros-lais-verde-large-1.png' },
    { id: 9, nome: 'Coxinha Fit de Batata Doce com Frango e Requeijão ', preco: 13, img: 'https://s2-receitas.glbimg.com/7HHi1Zrz6Dxt_G7N09l-NapN8X4=/0x0:1366x768/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2025/v/t/ceFth3Tnu97KDRgekajg/coxinha-de-galinha-com-massa-de-batata.jpg' },
    { id: 10, nome: 'Conjunto Infantil Menino', preco: 65.90, img: 'https://somoscorujas.cdn.magazord.com.br/img/2025/01/produto/45394/sc19758-1.png?ims=fit-in/400x533/filters:fill(white)' },
  ];

  // Estados para Favoritos
  const [filtroFavoritos, setFiltroFavoritos] = useState<'recentes' | 'barato' | 'caro'>('recentes');
  const [meusFavoritos, setMeusFavoritos] = useState<any[]>(() => {
    const salvos = localStorage.getItem('favoritos_itens');
    if (salvos) {
      try {
        const ids = JSON.parse(salvos);
        return ids.map((id: number) => PRODUTOS_DATA.find(p => p.id === id)).filter((p: any) => p !== undefined);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const ids = meusFavoritos.map(f => f.id);
    localStorage.setItem('favoritos_itens', JSON.stringify(ids));
  }, [meusFavoritos]);

  // Estado para Visto Recentemente
  const [vistoRecently, setVistoRecently] = useState([
    { id: 10, nome: "Azeite de Oliva Extra Virgem", preco: 62.00, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400" },
    { id: 11, nome: "Feijão Corda Novo", preco: 9.50, img: "https://images.unsplash.com/photo-1551462147-37885acc3c44?w=400" }
  ]);

  const [fotoPerfil, setFotoPerfil] = useState("https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=200");

  const COMPRAS_FINALIZADAS = [
    {
      id: "#88234",
      data: "12/04/2024",
      status: "Entregue",
      metodoPagamento: "Cartão de Crédito (Visa)",
      entrega: "Rua das Flores, 123 - Aracaju/SE",
      produtos: [
        { id: 1, nome: "Tomate Cereja Orgânico", qtd: "2kg", preco: "17.80", img: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=100" },
        { id: 4, nome: "Mel Silvestre Puro", qtd: "1un", preco: "45.00", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100" }
      ],
      total: "62.80"
    }
  ];

  const favoritosOrdenados = [...meusFavoritos].sort((a, b) => {
    if (filtroFavoritos === 'barato') return a.preco - b.preco;
    if (filtroFavoritos === 'caro') return b.preco - a.preco;
    return 0;
  });

  const handleTrocarFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (arquivo) {
      const urlNovaFoto = URL.createObjectURL(arquivo);
      setFotoPerfil(urlNovaFoto);
    }
  };

  // --- FUNÇÃO PARA REMOVER CARTÃO (RESOLVIDO) ---
  const removerCartao = (id: number) => {
    setMeusCartoes(meusCartoes.filter(c => c.id !== id));
  };

  // --- TELA VISTO RECENTEMENTE ---
  const renderVistoRecentemente = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 max-w-5xl mx-auto">
      <button onClick={() => setTelaAtual('perfil')} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#394158] bg-white px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all">
        <ArrowLeft size={14}/> Voltar
      </button>
      <h3 className="text-xl font-black font-poppins uppercase italic text-[#394158] px-2 tracking-tighter">Visto Recentemente</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-10 px-2">
        {vistoRecently.map((prod) => (
          <div key={prod.id} onClick={() => navigate(`/produto/${prod.id}`)} className="bg-white rounded-[1rem] p-3 shadow-xl border border-white flex flex-col h-full cursor-pointer active:scale-95 transition-all group">
            <div className="w-full aspect-square rounded-[0.8rem] overflow-hidden bg-[#F5F2ED] mb-3">
              <img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.nome} />
            </div>
            <div className="flex flex-col flex-1 px-1">
              <p className="text-[11px] font-black text-[#394158] leading-tight mb-auto group-hover:text-[#802D44]">{prod.nome}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                <span className="text-xs font-black text-[#55833d]">R$ {prod.preco.toFixed(2).replace('.', ',')}</span>
                <div className="p-2 bg-[#F5F2ED] text-gray-400 rounded-xl"><Eye size={14} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- TELA DE FAVORITOS ---
  const renderFavoritos = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 max-w-5xl mx-auto">
      <div className="flex items-center justify-between px-2">
        <button onClick={() => setTelaAtual('perfil')} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#394158] bg-white px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all">
          <ArrowLeft size={14}/> Voltar
        </button>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-50">
          <Filter size={14} className="text-[#55833d]" />
          <select value={filtroFavoritos} onChange={(e) => setFiltroFavoritos(e.target.value as any)} className="text-[9px] font-black uppercase bg-transparent outline-none text-[#394158] cursor-pointer">
            <option value="recentes">Recentes</option>
            <option value="barato">Menor Preço</option>
            <option value="caro">Maior Preço</option>
          </select>
        </div>
      </div>
      <h3 className="text-xl font-black font-poppins uppercase italic text-[#394158] px-2 tracking-tighter">Meus Favoritos</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-10 px-2">
        {favoritosOrdenados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-[1rem] p-3 shadow-xl shadow-[#394158]/5 border border-white flex flex-col h-full relative animate-in fade-in duration-500">
            <button onClick={(e) => { e.stopPropagation(); setMeusFavoritos(meusFavoritos.filter(f => f.id !== prod.id)); }} className="absolute top-4 right-4 z-10 p-2 bg-white/90 shadow-md rounded-full text-red-400 hover:text-red-600 active:scale-90 transition-all border border-gray-50" title="Remover dos favoritos">
              <HeartOff size={14} />
            </button>
            <div onClick={() => navigate(`/produto/${prod.id}`)} className="cursor-pointer group flex flex-col flex-1">
              <div className="w-full aspect-square rounded-[0.8rem] overflow-hidden bg-[#F5F2ED] mb-3">
                <img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.nome} />
              </div>
              <div className="flex flex-col flex-1 px-1">
                <p className="text-[11px] font-black text-[#394158] leading-tight mb-auto group-hover:text-[#802D44] transition-colors">{prod.nome}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                  <span className="text-xs font-black text-[#55833d]">R$ {prod.preco.toFixed(2).replace('.', ',')}</span>
                  <button onClick={(e) => { 
                    e.stopPropagation(); 
                    const carrinhoSalvo = localStorage.getItem('carrinho_itens');
                    let itens = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
                    if (!Array.isArray(itens)) itens = [];
                    const index = itens.findIndex((i: any) => i.id === prod.id);
                    if (index !== -1) itens[index].quantidade += 1;
                    else itens.push({ id: prod.id, quantidade: 1, selecionado: true });
                    const totalCount = itens.reduce((acc: number, curr: any) => acc + curr.quantidade, 0);
                    localStorage.setItem('carrinho_itens', JSON.stringify(itens));
                    localStorage.setItem('carrinho_count', totalCount.toString());
                    window.dispatchEvent(new Event('storage'));
                    alert('Adicionado!'); 
                  }} className="p-2.5 bg-[#F5F2ED] text-[#f9943b] rounded-xl active:scale-90 hover:bg-[#f9943b] hover:text-white transition-all shadow-sm">
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- TELAS DE CONFIGURAÇÕES ---
  const renderConfiguracoes = () => {
    switch (secaoConfig) {
      case 'conta':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 max-w-2xl mx-auto">
            <button onClick={() => setSecaoConfig('menu')} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#394158] mb-4 bg-white px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all">
              <ArrowLeft size={14}/> Voltar
            </button>
            <div className="px-2">
              <h3 className="text-xl font-black font-poppins uppercase italic text-[#394158]">Conta e Segurança</h3>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Atualize seus dados de acesso</p>
            </div>
            <form className="bg-white rounded-[1rem] p-8 shadow-xl border border-white space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-4 tracking-widest">Nome Completo</label>
                <input type="text" value={dadosUsuario.nome} onChange={(e) => setDadosUsuario({...dadosUsuario, nome: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-4 tracking-widest">E-mail</label>
                <input type="email" value={dadosUsuario.email} onChange={(e) => setDadosUsuario({...dadosUsuario, email: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-4 tracking-widest">Telefone</label>
                <input type="text" value={dadosUsuario.telefone} onChange={(e) => setDadosUsuario({...dadosUsuario, telefone: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-4 tracking-widest">Nova Senha</label>
                <input type="password" placeholder="Digite para alterar" className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" />
              </div>
              <button type="button" onClick={() => { alert('Dados da conta salvos!'); setSecaoConfig('menu'); }} className="w-full bg-[#55833d] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all">Salvar Alterações</button>
            </form>
          </div>
        );
      case 'enderecos':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <button onClick={() => exibirFormEndereco ? setExibirFormEndereco(false) : setSecaoConfig('menu')} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#394158] bg-white px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all"><ArrowLeft size={14}/> Voltar</button>
              {!exibirFormEndereco && meusEnderecos.length > 0 && (
                <button onClick={() => setExibirFormEndereco(true)} className="text-[10px] font-black uppercase text-[#55833d] bg-white px-4 py-2 rounded-full shadow-sm border border-gray-50">+ Adicionar Outro</button>
              )}
            </div>
            <div className="px-2">
              <h3 className="text-xl font-black font-poppins uppercase italic text-[#394158]">{exibirFormEndereco ? 'Novo Endereço' : 'Meus Endereços'}</h3>
            </div>
            {exibirFormEndereco ? (
              <form className="bg-white rounded-[1rem] p-8 shadow-xl border border-white space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 ml-4">Nome completo do Destinatário</label>
                    <input type="text" value={novoEndereco.destinatario} onChange={(e) => setNovoEndereco({...novoEndereco, destinatario: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158]" placeholder="Ex: Maria Silva" />
                  </div>
                  <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-gray-400 ml-4">Número de telefone</label><input type="text" value={novoEndereco.telefone} onChange={(e) => setNovoEndereco({...novoEndereco, telefone: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158]" placeholder="(00) 00000-0000" /></div>
                  <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-gray-400 ml-4">CEP</label><input type="text" value={novoEndereco.cep} onChange={(e) => setNovoEndereco({...novoEndereco, cep: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158]" placeholder="00000-000" /></div>
                  <div className="space-y-1.5 md:col-span-2"><label className="text-[9px] font-black uppercase text-gray-400 ml-4">Estado - Cidade</label><input type="text" value={novoEndereco.estadoCidade} onChange={(e) => setNovoEndereco({...novoEndereco, estadoCidade: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158]" placeholder="Sergipe - Aracaju" /></div>
                  <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-gray-400 ml-4">Bairro</label><input type="text" value={novoEndereco.bairro} onChange={(e) => setNovoEndereco({...novoEndereco, bairro: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158]" placeholder="Centro" /></div>
                  <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-gray-400 ml-4">Rua</label><input type="text" value={novoEndereco.rua} onChange={(e) => setNovoEndereco({...novoEndereco, rua: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158]" placeholder="Rua das Flores" /></div>
                  <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-gray-400 ml-4">Número</label><input type="text" value={novoEndereco.numero} onChange={(e) => setNovoEndereco({...novoEndereco, numero: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158]" placeholder="123" /></div>
                  <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-gray-400 ml-4">Complemento</label><input type="text" value={novoEndereco.complemento} onChange={(e) => setNovoEndereco({...novoEndereco, complemento: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158]" placeholder="Apt, Bloco..." /></div>
                </div>
                <div className="pt-4"><button type="button" onClick={() => { setMeusEnderecos([...meusEnderecos, novoEndereco]); setExibirFormEndereco(false); alert('Endereço salvo!'); }} className="w-full bg-[#55833d] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all">Salvar Endereço</button></div>
              </form>
            ) : (
              <div className="space-y-4">
                {meusEnderecos.length > 0 ? (
                  meusEnderecos.map((end, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[1rem] border border-white shadow-sm flex justify-between items-start animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-[#f9943b]">{end.destinatario}</p>
                        <p className="text-xs font-bold text-[#394158]">{end.rua}, {end.numero}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{end.bairro} • {end.estadoCidade}</p>
                        <p className="text-[10px] text-gray-400 font-bold">CEP: {end.cep}</p>
                      </div>
                      <button onClick={() => setMeusEnderecos(meusEnderecos.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-[1rem] border-2 border-dashed border-[#802D44]/20 text-center">
                    <div className="bg-[#F5F2ED] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><MapPin size={32} className="text-[#802D44] opacity-40" /></div>
                    <p className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest">Nenhum endereço cadastrado</p>
                    <button onClick={() => setExibirFormEndereco(true)} className="bg-[#802D44] text-white px-10 py-5 rounded-full font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">+ Adicionar Novo</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'cartoes':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => exibirFormCartao ? setExibirFormCartao(false) : setSecaoConfig('menu')} 
                className="flex items-center gap-2 text-[10px] font-black uppercase text-[#394158] bg-white px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all"
              >
                <ArrowLeft size={14}/> Voltar
              </button>
            </div>
            <div className="px-2">
              <h3 className="text-xl font-black font-poppins uppercase italic text-[#394158]">
                {exibirFormCartao ? 'Adicionar Cartão' : 'Pagamentos'}
              </h3>
            </div>
            {exibirFormCartao ? (
              <form className="bg-white rounded-[1rem] p-8 shadow-xl border border-white space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-4 tracking-widest">Número do Cartão</label>
                  <div className="relative">
                    <input type="text" maxLength={19} value={novoCartao.numero} onChange={(e) => setNovoCartao({...novoCartao, numero: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#f9943b]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" placeholder="0000 0000 0000 0000" />
                    <CardIcon className="absolute right-4 top-4 text-gray-300" size={20} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-4 tracking-widest">Nome no Cartão</label>
                  <input type="text" value={novoCartao.titular} onChange={(e) => setNovoCartao({...novoCartao, titular: e.target.value.toUpperCase()})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#f9943b]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" placeholder="JOÃO D SILVA" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-gray-400 ml-4 tracking-widest">Validade</label><input type="text" placeholder="MM/AA" value={novoCartao.validade} onChange={(e) => setNovoCartao({...novoCartao, validade: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#f9943b]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" /></div>
                  <div className="space-y-1.5"><label className="text-[9px] font-black uppercase text-gray-400 ml-4 tracking-widest">CVV</label><input type="text" placeholder="000" maxLength={3} value={novoCartao.cvv} onChange={(e) => setNovoCartao({...novoCartao, cvv: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#f9943b]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" /></div>
                </div>
                <div className="pt-4"><button type="button" onClick={() => { const final = novoCartao.numero.slice(-4); setMeusCartoes([...meusCartoes, { id: Date.now(), final, titular: novoCartao.titular, validade: novoCartao.validade }]); setExibirFormCartao(false); alert('Cartão adicionado!'); }} className="w-full bg-[#f9943b] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all">Confirmar Cartão</button></div>
              </form>
            ) : (
              <div className="space-y-6">
                {meusCartoes.map((cartao) => (
                  <div key={cartao.id} className="bg-gradient-to-br from-[#394158] to-[#1a1f2c] p-8 rounded-[1rem] text-white relative overflow-hidden shadow-2xl group animate-in fade-in duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="flex justify-between items-start mb-12 relative z-10">
                      <CardIcon size={32} className="text-[#f9943b]" />
                      {/* BOTÃO REMOVER - RESOLVIDO COM X */}
                      <button 
                        onClick={() => removerCartao(cartao.id)} 
                        className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition-all active:scale-90"
                      >
                        <X size={18} className="text-white" />
                      </button>
                    </div>
                    <p className="text-xl tracking-[0.3em] font-mono mb-8">**** **** **** {cartao.final}</p>
                    <div className="flex justify-between items-end">
                      <div><p className="text-[8px] uppercase opacity-40 font-black tracking-widest">Titular</p><p className="text-xs font-black uppercase">{cartao.titular}</p></div>
                      <div className="text-right"><p className="text-[8px] uppercase opacity-40 font-black tracking-widest">Validade</p><p className="text-xs font-black">{cartao.validade}</p></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setExibirFormCartao(true)} className="w-full py-6 bg-white border-2 border-dashed border-gray-200 rounded-[1rem] text-[10px] font-black uppercase text-gray-400 hover:border-[#f9943b] hover:text-[#f9943b] active:scale-95 transition-all flex items-center justify-center gap-3"><CardIcon size={18} /> + Adicionar Novo Cartão</button>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-3 animate-in fade-in duration-300">
            <h3 className="text-xl font-black font-poppins uppercase italic text-[#394158] mb-6 px-4">CONFIGURAÇÕES</h3>
            {[{id:'conta',icon:Lock,label:'Conta e Segurança'},{id:'enderecos',icon:MapPin,label:'Meus Endereços'},{id:'cartoes',icon:CreditCard,label:'Métodos de Pagamento'}].map((item)=>(
              <button key={item.id} onClick={()=>setSecaoConfig(item.id as any)} className="w-full flex items-center justify-between p-5 bg-white rounded-[1rem] border border-white shadow-sm active:scale-[0.98] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#F5F2ED] text-[#f9943b] rounded-2xl group-hover:bg-[#f9943b] group-hover:text-white transition-all"><item.icon size={20}/></div>
                  <span className="font-black uppercase text-[11px] text-[#394158] tracking-widest">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            ))}
          </div>
        );
    }
  };

  // --- TELAS DE COMPRAS ---
  const renderDetalhePedido = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <button onClick={() => setTelaAtual('compras')} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#394158] bg-white px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all"><ArrowLeft size={14}/> Voltar</button>
      <div className="bg-white rounded-[1rem] overflow-hidden shadow-xl border border-white">
        <div className="bg-[#394158] p-8 text-white"><p className="text-[10px] font-black uppercase opacity-60 mb-1">Recibo Digital</p><h3 className="text-2xl font-black font-poppins italic uppercase tracking-tighter">{pedidoSelecionado.id}</h3></div>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F2ED] p-4 rounded-[2rem] flex items-center gap-4 border border-gray-100"><Calendar size={20} className="text-[#f9943b]" /><div><p className="text-[8px] font-black uppercase opacity-40">Data</p><p className="text-xs font-bold">{pedidoSelecionado.data}</p></div></div>
            <div className="bg-[#F5F2ED] p-4 rounded-[2rem] flex items-center gap-4 border border-gray-100"><CardIcon size={20} className="text-[#f9943b]" /><div><p className="text-[8px] font-black uppercase opacity-40">Pagamento</p><p className="text-xs font-bold">{pedidoSelecionado.metodoPagamento}</p></div></div>
          </div>
          <div className="space-y-4">
            {pedidoSelecionado.produtos.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between bg-white p-2 rounded-3xl border border-gray-50 group">
                <div className="flex items-center gap-4"><img src={p.img} className="w-14 h-14 rounded-2xl object-cover shadow-sm" /><div><p className="text-sm font-black text-[#394158]">{p.nome}</p><p className="text-[10px] font-bold text-[#802D44]">R$ {p.preco}</p></div></div>
                <button onClick={() => {
                  const carrinhoSalvo = localStorage.getItem('carrinho_itens');
                  let itens = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
                  if (!Array.isArray(itens)) itens = [];
                  const index = itens.findIndex((i: any) => i.id === p.id);
                  if (index !== -1) itens[index].quantidade += 1;
                  else itens.push({ id: p.id, quantidade: 1, selecionado: true });
                  const totalCount = itens.reduce((acc: number, curr: any) => acc + curr.quantidade, 0);
                  localStorage.setItem('carrinho_itens', JSON.stringify(itens));
                  localStorage.setItem('carrinho_count', totalCount.toString());
                  window.dispatchEvent(new Event('storage'));
                  alert(`${p.nome} adicionado!`);
                }} className="p-4 bg-[#F5F2ED] text-[#f9943b] rounded-2xl active:scale-90 hover:bg-[#f9943b] hover:text-white transition-all"><ShoppingCart size={18} /></button>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-dashed flex flex-col gap-4">
             <div className="flex justify-between items-baseline px-2"><span className="font-black uppercase text-[10px] opacity-30">Total Pago</span><span className="text-2xl font-black text-[#55833d]">R$ {pedidoSelecionado.total}</span></div>
             <button onClick={() => { 
                const carrinhoSalvo = localStorage.getItem('carrinho_itens');
                let itens = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
                if (!Array.isArray(itens)) itens = [];
                
                // Desmarca itens que já estavam no carrinho
                itens = itens.map((i: any) => ({ ...i, selecionado: false }));

                pedidoSelecionado.produtos.forEach((p: any) => {
                  const index = itens.findIndex((i: any) => i.id === p.id);
                  if (index !== -1) {
                    itens[index].quantidade += 1;
                    itens[index].selecionado = true; // Marca os do pedido atual
                  } else {
                    itens.push({ id: p.id, quantidade: 1, selecionado: true });
                  }
                });
                const totalCount = itens.reduce((acc: number, curr: any) => acc + curr.quantidade, 0);
                localStorage.setItem('carrinho_itens', JSON.stringify(itens));
                localStorage.setItem('carrinho_count', totalCount.toString());
                window.dispatchEvent(new Event('storage'));
                navigate('/carrinho'); 
             }} className="w-full bg-[#55833d] text-white py-5 rounded-[1rem] font-black uppercase text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"><RotateCcw size={16}/> Comprar pedido completo</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRastreioPedido = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <button onClick={() => setTelaAtual('compras')} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#394158] bg-white px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all"><ArrowLeft size={14}/> Voltar</button>
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f9943b]/10 rounded-full -mr-16 -mt-16"></div>
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest mb-1">Pedido {pedidoSelecionado?.id}</p>
            <h3 className="text-xl font-black font-poppins italic text-[#394158] uppercase">Acompanhe seu pedido</h3>
          </div>
        </div>
        
        <div className="relative pt-4 pb-8 mb-4">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-1.5 bg-gray-100 rounded-full"></div>
          <div className="absolute top-8 left-[12.5%] w-[50%] h-1.5 bg-gradient-to-r from-[#f9943b] to-[#fbac66] rounded-full transition-all duration-1000 ease-out shadow-sm"></div>
          
          <div className="flex justify-between relative z-10">
            <div className="flex flex-col items-center gap-3 group w-1/4">
              <div className="w-10 h-10 rounded-full bg-[#f9943b] text-white flex items-center justify-center shadow-md border-4 border-white transition-transform group-hover:scale-110">
                <CheckCircle size={16} />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase text-[#394158]">Confirmado</p>
                <p className="text-[8px] font-bold text-gray-400">09:41</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 group w-1/4">
              <div className="w-10 h-10 rounded-full bg-[#f9943b] text-white flex items-center justify-center shadow-md border-4 border-white transition-transform group-hover:scale-110">
                <Package size={16} />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase text-[#394158]">Preparando</p>
                <p className="text-[8px] font-bold text-gray-400">10:15</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 group w-1/4">
              <div className="w-14 h-14 -mt-2 rounded-full bg-white text-[#f9943b] flex items-center justify-center shadow-xl border-4 border-[#f9943b] transition-transform group-hover:scale-110 relative">
                <Truck size={22} />
              </div>
              <div className="text-center mt-1">
                <p className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest">A Caminho</p>
                <p className="text-[9px] font-bold text-gray-500">Previsão: 12:30</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 group w-1/4">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-4 border-white transition-transform group-hover:scale-110">
                <MapPin size={16} />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase text-gray-400">Entregue</p>
                <p className="text-[8px] font-bold text-gray-400">--:--</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F2ED] rounded-2xl p-5 border border-gray-100 mb-4">
          <h4 className="text-[10px] font-black font-montserrat uppercase text-[#394158] tracking-widest mb-4">Histórico de Rastreio</h4>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
            <div className="relative flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-[#f9943b] text-white flex items-center justify-center shrink-0 mt-0.5 relative z-10"><MapPin size={10} /></div>
              <div><p className="text-xs font-bold text-[#394158]">Chegou em Aracaju, SE</p><p className="text-[9px] font-black uppercase text-gray-400">Hoje, 10:30</p></div>
            </div>
            <div className="relative flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center shrink-0 mt-0.5 relative z-10"><Truck size={10} /></div>
              <div><p className="text-xs font-bold text-gray-500">Em trânsito para Sergipe</p><p className="text-[9px] font-black uppercase text-gray-400">Ontem, 18:45</p></div>
            </div>
            <div className="relative flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center shrink-0 mt-0.5 relative z-10"><Package size={10} /></div>
              <div><p className="text-xs font-bold text-gray-500">Saiu de Recife, PE</p><p className="text-[9px] font-black uppercase text-gray-400">Ontem, 14:20</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center gap-5 border border-gray-100 shadow-sm">
          <div className="bg-[#f9943b]/10 p-4 rounded-full text-[#f9943b]">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Endereço de Entrega</p>
            <p className="text-sm font-bold text-[#394158]">Rua das Palmeiras, 450 - Atalaia</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTelaCompras = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <button onClick={() => setTelaAtual('perfil')} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#394158] bg-white px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all"><ArrowLeft size={14}/> Voltar ao Perfil</button>
      <section className="bg-white rounded-[1rem] shadow-xl border border-white overflow-hidden">
        <div className="flex border-b border-gray-50 overflow-x-auto scrollbar-hide bg-white">
          {[{id:'pagar',l:'A Pagar',i:Wallet},{id:'preparando',l:'Preparando',i:Package},{id:'caminho',l:'A Caminho',i:Truck},{id:'finalizados',l:'Finalizados',i:ShoppingBag}].map((tab)=>(
            <button key={tab.id} onClick={() => setAbaAtiva(tab.id as any)} className={`flex-1 min-w-[80px] py-6 flex flex-col items-center gap-2 relative ${abaAtiva === tab.id ? 'text-[#55833d]' : 'text-gray-300'}`}><tab.i size={18} /><span className="text-[8px] font-black uppercase tracking-tighter">{tab.l}</span>{abaAtiva === tab.id && <div className="absolute bottom-0 w-8 h-1 bg-[#55833d] rounded-t-full" />}</button>
          ))}
        </div>
        <div className="p-8 min-h-[400px] bg-[#FDFCFB]">
          {abaAtiva === 'finalizados' ? (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} onClick={() => { setPedidoSelecionado(pedido); setTelaAtual('detalhe-pedido'); }} className="bg-gradient-to-r from-[#55833d]/10 to-[#55833d]/5 rounded-[1rem] p-6 border border-[#55833d]/10 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:shadow-md group">
                  <div className="flex items-center gap-5">
                    <div className="flex -space-x-4">{pedido.produtos?.map((p: any, idx: number) => <img key={idx} src={p.img} className="w-14 h-14 rounded-2xl border-4 border-white object-cover" />)}</div>
                    <div><p className="text-[10px] font-black text-[#55833d] uppercase">Pedido {pedido.id}</p><h4 className="text-lg font-black font-montserrat text-[#394158] italic">R$ {pedido.total}</h4><p className="text-[9px] font-black uppercase text-[#55833d] flex items-center gap-1"><CheckCircle size={10} /> Finalizada</p></div>
                  </div>
                  <div className="bg-white p-3 rounded-full text-[#55833d] shadow-sm transition-all"><ChevronRight size={20} /></div>
                </div>
              ))}
            </div>
          ) : abaAtiva === 'caminho' ? (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-gradient-to-r from-[#f9943b]/10 to-[#f9943b]/5 rounded-[1rem] p-6 border border-[#f9943b]/10 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-md group">
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="flex -space-x-4">{pedido.produtos?.map((p: any, idx: number) => <img key={idx} src={p.img} className="w-14 h-14 rounded-2xl border-4 border-white object-cover" />)}</div>
                    <div><p className="text-[10px] font-black text-[#f9943b] uppercase">Pedido {pedido.id}</p><h4 className="text-lg font-black font-montserrat text-[#394158] italic">R$ {pedido.total}</h4><p className="text-[9px] font-black uppercase text-[#f9943b] flex items-center gap-1"><Truck size={10} /> A Caminho</p></div>
                  </div>
                  <button onClick={() => { setPedidoSelecionado(pedido); setTelaAtual('rastreio-pedido'); }} className="w-full md:w-auto bg-[#f9943b] text-white px-6 py-4 md:py-3 rounded-[1.5rem] md:rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all text-center">Rastrear Pedido</button>
                </div>
              ))}
            </div>
          ) : (<div className="flex flex-col items-center justify-center py-10 opacity-20"><ShoppingBag size={48} className="mb-4" /><p className="text-[10px] font-black uppercase tracking-widest">Vazio</p></div>)}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] font-inter pb-24 md:pb-10">
      <input type="file" ref={fileInputRef} onChange={handleTrocarFoto} accept="image/*" className="hidden" />
      <header className="w-full bg-white/80 backdrop-blur-md py-6 px-6 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center relative">
          <div className="flex-1 flex justify-start">
            <button onClick={() => telaAtual === 'perfil' ? navigate('/home2') : setTelaAtual('perfil')} className="p-3 active:scale-90 transition-all"><ArrowLeft size={20} className="text-[#802D44]" /></button>
          </div>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-black font-poppins uppercase italic text-[#394158]">PERFIL</h2>
          <div className="flex-1 flex items-center justify-end gap-2">
            {telaAtual === 'perfil' && <button onClick={() => setTelaAtual('configuracoes')} className="p-3 active:scale-90 transition-all"><Settings size={20} /></button>}
            <button onClick={() => navigate('/')} className="p-3 text-red-500 active:scale-90 transition-all"><LogOut size={20} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8">
        {telaAtual === 'configuracoes' ? renderConfiguracoes() : telaAtual === 'compras' ? renderTelaCompras() : telaAtual === 'detalhe-pedido' ? renderDetalhePedido() : telaAtual === 'rastreio-pedido' ? renderRastreioPedido() : telaAtual === 'favoritos' ? renderFavoritos() : telaAtual === 'recentes' ? renderVistoRecentemente() : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-gradient-to-r from-[#f9943b] to-[#fbac66] rounded-[1rem] p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-[#f9943b] overflow-hidden shadow-inner bg-white/20"><img src={fotoPerfil} className="w-full h-full object-cover" alt="User"/></div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#55833d] p-2.5 rounded-full border-2 border-[#f9943b] shadow-lg active:scale-90 transition-all"><Camera size={14} className="text-white" /></button>
              </div>
              <div className="text-center md:text-left z-10"><h3 className="text-2xl font-black font-poppins italic uppercase leading-none mb-2 tracking-tight">{dadosUsuario.nome}</h3><span className="text-[10px] font-black uppercase bg-white px-4 py-1.5 rounded-full flex items-center gap-1.5 text-[#55833d] shadow-sm"><CheckCircle size={12} className="text-[#4ade80]" /> Comprador Verificado</span></div>
            </div>

            <section className="bg-white rounded-[1rem] p-8 shadow-xl border border-white">
              <div className="flex justify-between items-center mb-8 px-2">
                <h4 className="text-[10px] font-black font-montserrat uppercase tracking-[0.2em] text-gray-400">Minhas Compras</h4>
                <button onClick={() => { setAbaAtiva('finalizados'); setTelaAtual('compras'); }} className="text-[9px] font-black uppercase text-[#394158] bg-[#802D44]/5 px-4 py-2 rounded-full active:scale-95 transition-all">Histórico</button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  {i: Wallet, t: 'A Pagar', id: 'pagar'}, {i: Package, t: 'Preparando', id: 'preparando'}, 
                  {i: Truck, t: 'A Caminho', id: 'caminho'}, {i: ShoppingBag, t: 'Finalizados', id: 'finalizados'}
                ].map((item) => (
                  <div key={item.t} onClick={() => { setAbaAtiva(item.id as any); setTelaAtual('compras'); }} className="flex flex-col items-center gap-3 group cursor-pointer active:scale-90 transition-all">
                    <div className="w-14 h-14 bg-[#F5F2ED] rounded-2xl flex items-center justify-center text-[#394158] group-hover:bg-[#55833d] group-hover:text-white transition-all duration-300 shadow-sm"><item.i size={22} /></div>
                    <span className="text-[9px] font-black uppercase text-center tracking-tighter opacity-60">{item.t}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[1rem] p-4 md:p-8 shadow-xl border border-white">
              <div className="flex justify-center items-center mb-4 md:mb-8 px-2"><h4 className="text-[10px] font-black font-montserrat uppercase tracking-[0.2em] text-gray-400">Atividades</h4></div>
              <div className="grid grid-cols-1 md:grid-cols-3 w-full divide-y divide-gray-100 md:divide-y-0">
                <div className="flex justify-center w-full py-4 md:py-0">
                  <button onClick={() => setTelaAtual('favoritos')} className="flex flex-col items-center justify-center p-4 hover:bg-[#F5F2ED] rounded-[1rem] active:scale-[0.98] group transition-all w-full md:w-32 gap-3 text-center">
                    <div className="text-[#55833d] group-hover:scale-110 transition-transform"><Heart size={24} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Favoritos</span>
                  </button>
                </div>
                <div className="flex justify-center w-full py-4 md:py-0">
                  <button onClick={() => setTelaAtual('recentes')} className="flex flex-col items-center justify-center p-4 hover:bg-[#F5F2ED] rounded-[1rem] active:scale-[0.98] group transition-all w-full md:w-32 gap-3 text-center">
                    <div className="text-[#802D44] group-hover:scale-110 transition-transform"><History size={24} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Visto<br className="hidden md:block"/>Recentemente</span>
                  </button>
                </div>
                <div className="flex justify-center w-full py-4 md:py-0">
                  <button className="flex flex-col items-center justify-center p-4 hover:bg-[#F5F2ED] rounded-[1rem] active:scale-[0.98] group transition-all w-full md:w-32 gap-3 text-center">
                    <div className="text-[#f9943b] group-hover:scale-110 transition-transform"><HelpCircle size={24} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Ajuda e<br className="hidden md:block"/>Suporte</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}