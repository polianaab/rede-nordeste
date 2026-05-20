import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Plus, Filter, MapPin, 
  MessageCircle, ChevronRight, Menu, X, Bell, Trash2, 
  Package, Info, DollarSign, TrendingUp, Clock, Edit2, 
  CheckCircle, Store, Tag, Image as ImageIcon, Settings
} from 'lucide-react';

// --- DADOS INICIAIS MOCKADOS ---
const PRODUTOS_INICIAIS = [
  { id: 1, categoria: 'Hortifruti', nome: 'Tomate Cereja Orgânico', local: 'Sítio Alvorada, SE', preco: 8.90, un: 'kg', estoque: 45, vendas: 120, img: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/beirario/media/uploads/produtos/foto/b3fd841dfd2c3file.png' },
  { id: 2, categoria: 'Laticínios', nome: 'Ovos Caipira (Dúzia)', local: 'Granja Girassol, BA', preco: 14.50, un: 'dz', estoque: 12, vendas: 85, img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80' },
  { id: 5, categoria: 'Laticínios', nome: 'Queijo Coalho Tradicional', local: 'Fazenda Alvorada, SE', preco: 38.00, un: 'kg', estoque: 12, vendas: 85, img: 'https://api.ootimista.com.br/wp-content/uploads/2023/02/queijo-coalho-embrapa.jpg' },
  { id: 4, categoria: 'Artesanato', nome: 'Cesto de Palha Ouricuri', local: 'Ilha do Ferro, AL', preco: 120.00, un: 'un', estoque: 5, vendas: 12, img: 'https://img.elo7.com.br/product/zoom/3996150/cesto-de-palha-com-alca-40cm-cesto-de-palha.jpg' },
  { id: 7, categoria: 'Grãos', nome: 'Feijão Verde Fresco', local: 'Fazenda Alvorada, SE', preco: 15.00, un: 'kg', estoque: 30, vendas: 40, img: 'https://receitadaboa.com.br/wp-content/uploads/2024/09/Feijao-verde-nordestino.jpg' },
];

const NOTIFICACOES_DATA = [
  { id: 1, titulo: 'Venda Realizada! 🎉', mensagem: 'Novo pedido #4582 para preparar.', tempo: 'Há 2 horas', lida: false, icone: Package, cor: 'text-[#f9943b]', bg: 'bg-[#f9943b]/10' },
  { id: 2, titulo: 'Estoque Baixo ⚠️', mensagem: 'Seu Queijo Coalho está com apenas 2kg.', tempo: 'Há 5 horas', lida: false, icone: Info, cor: 'text-red-500', bg: 'bg-red-500/10' },
];

const ULTIMOS_PEDIDOS = [
  { id: '#4582', cliente: 'João Silva', total: 45.90, status: 'Preparando', data: 'Hoje, 09:20' },
  { id: '#4581', cliente: 'Maria Oliveira', total: 120.00, status: 'Pendente', data: 'Hoje, 08:15' },
  { id: '#4579', cliente: 'Carlos Santos', total: 89.00, status: 'Enviado', data: 'Ontem, 17:40' },
];

export default function PainelVendedor() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [notifAberta, setNotifAberta] = useState(false); 
  const [modalProduto, setModalProduto] = useState(false); 
  const [modalLoja, setModalLoja] = useState(false);
  const [formLoja, setFormLoja] = useState({
    nomeLoja: 'Fazenda Alvorada',
    descricao: '',
    cidade: 'Aracaju',
    estado: 'SE',
    logoUrl: ''
  });
  
  // --- ESTADO GLOBAL DOS PRODUTOS ---
  const [produtosGlobais, setProdutosGlobais] = useState<any[]>([]);

  // Estados do Formulário de Cadastro COM SUPORTE A FOTOS
  const [formProduto, setFormProduto] = useState({
    nome: '',
    categoria: '',
    preco: '',
    estoque: '',
    unidade: 'un',
    descricao: '',
    imagens: [] as string[] // Array para guardar as fotos
  });

  const [ordenacaoProd, setOrdenacaoProd] = useState('a_z');
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_DATA); 
  const [carrinhoCount, setCarrinhoCount] = useState(() => {
    const salvo = localStorage.getItem('carrinho_count');
    return salvo ? parseInt(salvo) : 0;
  });

  const [pedidosGlobais, setPedidosGlobais] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('user_role', 'vendedor');
    
    const carregarProdutos = () => {
      const salvos = localStorage.getItem('produtos_globais');
      if (salvos) {
        setProdutosGlobais(JSON.parse(salvos));
      } else {
        localStorage.setItem('produtos_globais', JSON.stringify(PRODUTOS_INICIAIS));
        setProdutosGlobais(PRODUTOS_INICIAIS);
      }
    };
    
    const carregarPedidos = () => {
      const salvos = localStorage.getItem('pedidos_globais');
      if (salvos) setPedidosGlobais(JSON.parse(salvos));
    };

    const carregarLoja = () => {
      const lojaSalva = localStorage.getItem('loja_config');
      if (lojaSalva) setFormLoja(JSON.parse(lojaSalva));
    };

    carregarProdutos();
    carregarPedidos();
    carregarLoja();

    const atualizarUI = () => {
      const c = localStorage.getItem('carrinho_count');
      setCarrinhoCount(c ? parseInt(c) : 0);
      carregarProdutos(); 
      carregarPedidos();
    };
    atualizarUI();
    window.addEventListener('storage', atualizarUI);
    return () => window.removeEventListener('storage', atualizarUI);
  }, []);

  const atualizarEstoque = (id: number, delta: number) => {
    const novaLista = produtosGlobais.map(p => {
      if (p.id === id) return { ...p, estoque: Math.max(0, p.estoque + delta) };
      return p;
    });
    setProdutosGlobais(novaLista);
    localStorage.setItem('produtos_globais', JSON.stringify(novaLista));
    window.dispatchEvent(new Event('storage'));
  };

  const deletarProdutoLocal = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const novaLista = produtosGlobais.filter(p => p.id !== id);
      setProdutosGlobais(novaLista);
      localStorage.setItem('produtos_globais', JSON.stringify(novaLista));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const atualizarStatusPedido = (id: string, novoStatus: string) => {
    const novaLista = pedidosGlobais.map(p => {
      if (p.id === id) return { ...p, status: novoStatus };
      return p;
    });
    setPedidosGlobais(novaLista);
    localStorage.setItem('pedidos_globais', JSON.stringify(novaLista));
    window.dispatchEvent(new Event('storage'));
  };

  // --- LÓGICA DE UPLOAD DE IMAGEM ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Verifica se vai ultrapassar 5 fotos
    if (formProduto.imagens.length + files.length > 5) {
      alert("Você só pode adicionar no máximo 5 fotos por produto.");
      return;
    }

    // Converte os arquivos para Base64 para podermos mostrar no preview e salvar localmente
    Promise.all(files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    })).then(base64Images => {
       setFormProduto(prev => ({...prev, imagens: [...prev.imagens, ...base64Images]}));
    });
  };

  const removerImagem = (indexParaRemover: number) => {
    setFormProduto(prev => ({
      ...prev,
      imagens: prev.imagens.filter((_, index) => index !== indexParaRemover)
    }));
  };

  // --- LÓGICA DA LOJINHA ---
  const salvarLoja = () => {
    if (!formLoja.nomeLoja) {
      alert("O Nome da Loja é obrigatório.");
      return;
    }
    localStorage.setItem('loja_config', JSON.stringify(formLoja));
    setModalLoja(false);
    alert('Configurações da loja salvas com sucesso!');
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormLoja({...formLoja, logoUrl: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  // --- LÓGICA PARA SALVAR O NOVO PRODUTO ---
  const cadastrarProduto = () => {
    if (!formProduto.nome || !formProduto.preco || !formProduto.categoria) {
      alert("Preencha os campos obrigatórios (Nome, Preço e Categoria)!");
      return;
    }

    const novoId = Date.now(); 
    const precoFormatado = parseFloat(formProduto.preco.replace(',', '.'));
    
    // Pega a primeira foto ou uma genérica se ele não colocar nada
    const fotoPrincipal = formProduto.imagens.length > 0 
      ? formProduto.imagens[0] 
      : 'https://images.unsplash.com/photo-1595858718919-6126a11e89ce?auto=format&fit=crop&w=400&q=80';

    const novoProduto = {
      id: novoId,
      nome: formProduto.nome,
      categoria: formProduto.categoria,
      preco: isNaN(precoFormatado) ? 0 : precoFormatado,
      estoque: parseInt(formProduto.estoque) || 0,
      descricao: formProduto.descricao,
      local: 'Fazenda Alvorada, SE', 
      un: formProduto.unidade,
      vendas: 0,
      img: fotoPrincipal,
      galeria: formProduto.imagens // Salva todas as fotos se precisarmos para a página de Detalhes depois
    };

    const novaLista = [novoProduto, ...produtosGlobais];
    setProdutosGlobais(novaLista);
    localStorage.setItem('produtos_globais', JSON.stringify(novaLista));
    
    window.dispatchEvent(new Event('storage'));

    // Limpa o formulário e fecha o modal
    setFormProduto({ nome: '', categoria: '', preco: '', estoque: '', unidade: 'un', descricao: '', imagens: [] });
    setModalProduto(false);
    alert("Produto cadastrado com sucesso!");
  };

  const meusProdutos = produtosGlobais.filter(p => p.local === 'Fazenda Alvorada, SE');

  const getMeusProdutosOrdenados = () => {
    let filtrados = [...meusProdutos];
    if (busca) filtrados = filtrados.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
    
    if (ordenacaoProd === 'a_z') filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (ordenacaoProd === 'z_a') filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
    else if (ordenacaoProd === 'menor_preco') filtrados.sort((a, b) => a.preco - b.preco);
    else if (ordenacaoProd === 'maior_preco') filtrados.sort((a, b) => b.preco - a.preco);
    return filtrados;
  };

  const produtosExibidos = getMeusProdutosOrdenados();



  return (
    <div className="min-h-screen bg-gray-50/30 text-[#394158] antialiased pb-20 font-sans">
      
      {/* NAVBAR */}
      <header className="w-full bg-white py-4 px-4 md:px-8 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4 md:gap-8">
          <div className="flex items-center gap-4 md:gap-10 flex-shrink-0 -ml-2 md:-ml-6">
            <Link to="/vendedor"><img src="/assets/logo-home.png" alt="Logo" className="h-10 md:h-12" /></Link>
            <nav className="hidden lg:flex gap-6 text-xs md:text-sm font-medium text-[#394158]">
              <Link to="/vendedor" className="hover:text-[#f9943b] transition-colors">Início</Link>
              <Link to="/receitasvendedor" className="hover:text-[#f9943b] transition-colors">Receitas</Link>
              <Link to="/blog" className="hover:text-[#f9943b] transition-colors">Notícias</Link>
               <Link to="/painelvendedor" className="text-[#f9943b] border-b-2 border-[#f9943b] pb-1">Painel Vendedor</Link>
            </nav>
          </div>
          <div className="relative flex-1 max-w-xl hidden md:block">
            <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar nos meus produtos..." className="w-full bg-[#F5F2ED] py-2.5 pl-5 pr-12 rounded-full outline-none text-sm" />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#55833d] text-white p-2 rounded-full"><Search size={16} /></button>
          </div>
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            <div className="hidden md:flex items-center gap-1 relative">
              <div className="relative">
                <button onClick={() => setNotifAberta(!notifAberta)} className={`p-2.5 rounded-full transition-all duration-300 relative ${notifAberta ? 'bg-[#f9943b] text-white shadow-lg' : 'hover:bg-[#f9943b] hover:text-white text-[#394158]'}`}>
                  <Bell size={22} />
                  {notificacoes.filter(n => !n.lida).length > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{notificacoes.filter(n => !n.lida).length}</span>}
                </button>

                {notifAberta && (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setNotifAberta(false)}></div>
                    <div className="absolute top-14 right-0 w-[320px] md:w-[380px] bg-white rounded-[1rem] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 z-[70] animate-in slide-in-from-top-2 overflow-hidden">
                      <header className="p-4 border-b border-gray-50 flex justify-between items-center bg-white">
                        <h3 className="text-sm font-black uppercase italic text-[#394158]">Notificações</h3>
                        <div className="flex gap-2">
                           <button onClick={() => setNotificacoes([])} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16}/></button>
                           <button onClick={() => setNotifAberta(false)} className="text-gray-400 hover:text-[#394158] p-1"><X size={16}/></button>
                        </div>
                      </header>
                      <div className="max-h-[350px] overflow-y-auto no-scrollbar bg-white">
                        {notificacoes.length > 0 ? notificacoes.map(n => (
                          <div key={n.id} onClick={() => setNotificacoes(notificacoes.map(not => not.id === n.id ? {...not, lida: true} : not))} className={`flex gap-4 p-4 border-b border-gray-50 transition-all cursor-pointer hover:bg-gray-50 relative ${!n.lida ? 'bg-[#f9943b]/5' : 'opacity-60'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.bg} ${n.cor}`}><n.icone size={18}/></div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-[11px] font-black uppercase truncate text-[#394158]">{n.titulo}</h4>
                               <p className="text-[10px] font-bold text-gray-500 leading-snug line-clamp-2">{n.mensagem}</p>
                            </div>
                            {!n.lida && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#f9943b] rounded-full"></div>}
                          </div>
                        )) : <div className="py-16 text-center opacity-20 flex flex-col items-center gap-2"><Bell size={40}/><p className="text-[10px] font-black uppercase italic">Vazio</p></div>}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link to="/chat" className="p-2.5 rounded-full hover:bg-[#f9943b] hover:text-white transition-all text-[#394158]"><MessageCircle size={22} /></Link>
              <Link to="/carrinho" className="p-2.5 rounded-full hover:bg-[#f9943b] hover:text-white transition-all text-[#394158] relative group">
                <ShoppingCart size={22} />
                {carrinhoCount > 0 && <span className="absolute top-0 right-0 bg-white text-[#f9943b] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">{carrinhoCount}</span>}
              </Link>
              <Link to="/perfilvendedor" className="p-2.5 rounded-full hover:bg-[#f9943b] hover:text-white transition-all text-[#394158]"><User size={22} /></Link>
            </div>
            <button onClick={() => setMenuAberto(true)} className="md:hidden p-2"><Menu size={28} /></button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE COM TODAS AS OPÇÕES RESTAURADAS */}
      {menuAberto && (
        <div className="fixed inset-0 z-[110] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuAberto(false)}></div>
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-8 flex flex-col gap-8 animate-in slide-in-from-right duration-300">
            <button onClick={() => setMenuAberto(false)} className="self-end p-2 bg-[#F5F2ED] rounded-full text-[#394158] hover:text-red-500 transition-all"><X size={24} /></button>
            <nav className="flex flex-col gap-5 text-sm font-black uppercase tracking-widest text-[#394158]">
                <Link to="/vendedor" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><ChevronRight size={14}/> Início</Link>
                <Link to="/receitasvendedor" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><ChevronRight size={14}/> Receitas</Link>
                <Link to="/blog" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#f9943b]"><ChevronRight size={14}/> Notícias</Link>
                <Link to="/painelvendedor" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 text-[#55833d]"><ChevronRight size={14}/> Painel Vendedor</Link>
                <hr className="border-gray-50 my-2" />
                <Link to="/notificacoes" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><Bell size={20}/> Notificações</Link>
                <Link to="/chat" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><MessageCircle size={20}/> Chat</Link>
                <Link to="/carrinho" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d] relative">
                  <ShoppingCart size={20}/> Carrinho 
                  {carrinhoCount > 0 && <span className="bg-[#f9943b] text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">{carrinhoCount}</span>}
                </Link>
                <Link to="/perfilvendedor" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><User size={20}/> Meu Perfil</Link>
            </nav>
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR PRODUTO ATUALIZADO COM UPLOAD REAL */}
      {modalProduto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#394158]/80 backdrop-blur-sm" onClick={() => setModalProduto(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[1rem] overflow-hidden shadow-2xl animate-in zoom-in-95 border border-[#F5F2ED]">
            <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F5F2ED]/50">
               <h3 className="text-lg font-black uppercase italic tracking-widest text-[#394158]">Novo Produto</h3>
               <button onClick={() => setModalProduto(false)} className="p-2 hover:bg-white text-gray-400 hover:text-red-500 rounded-full transition-all"><X size={24}/></button>
            </header>
            
            <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
               <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 space-y-1">
                     <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Nome do Produto</label>
                     <input 
                        type="text" 
                        value={formProduto.nome}
                        onChange={e => setFormProduto({...formProduto, nome: e.target.value})}
                        placeholder="Ex: Mel Silvestre" 
                        className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] focus:bg-white transition-all" 
                     />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1 space-y-1">
                     <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Categoria</label>
                     <select 
                        value={formProduto.categoria}
                        onChange={e => setFormProduto({...formProduto, categoria: e.target.value})}
                        className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] focus:bg-white transition-all cursor-pointer"
                     >
                       <option value="">Selecione...</option>
                       <option value="Hortifruti">Hortifruti</option>
                       <option value="Laticínios">Laticínios</option>
                       <option value="Grãos">Grãos</option>
                       <option value="Artesanato">Artesanato</option>
                       <option value="Carnes">Carnes</option>
                       <option value="Colheita">Colheita</option>
                       <option value="Gastronomia">Gastronomia</option>
                       <option value="Cama Mesa e Banho">Cama Mesa e Banho</option>
                       <option value="Têxtil">Têxtil</option>
                     </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1">
                     <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Preço (R$)</label>
                     <input 
                        type="text" 
                        value={formProduto.preco}
                        onChange={e => setFormProduto({...formProduto, preco: e.target.value})}
                        placeholder="00,00" 
                        className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] focus:bg-white transition-all" 
                     />
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1">
                     <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Estoque Inicial</label>
                     <input 
                        type="number" 
                        value={formProduto.estoque}
                        onChange={e => setFormProduto({...formProduto, estoque: e.target.value})}
                        placeholder="10" 
                        className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] focus:bg-white transition-all" 
                     />
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1">
                     <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Unidade de Medida</label>
                     <select 
                        value={formProduto.unidade}
                        onChange={e => setFormProduto({...formProduto, unidade: e.target.value})}
                        className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] focus:bg-white transition-all cursor-pointer"
                     >
                       <option value="un">Unidade (un)</option>
                       <option value="kg">Quilograma (kg)</option>
                       <option value="g">Grama (g)</option>
                       <option value="l">Litro (L)</option>
                       <option value="ml">Mililitro (ml)</option>
                       <option value="dz">Dúzia (dz)</option>
                       <option value="bdj">Bandeja (bdj)</option>
                     </select>
                  </div>

                  <div className="col-span-2 space-y-1 mt-2">
                     <label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2 flex items-center gap-1">
                        <Info size={14} /> Sobre o Produto
                     </label>
                     <textarea 
                        rows={3} 
                        value={formProduto.descricao}
                        onChange={e => setFormProduto({...formProduto, descricao: e.target.value})}
                        placeholder="Descreva os detalhes, origem e benefícios do seu produto..." 
                        className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] focus:bg-white transition-all resize-none"
                     ></textarea>
                  </div>
               </div>

               {/* ÁREA DE FOTOS FUNCIONAL */}
               <div className="space-y-2 mt-4">
                  <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Fotos do Produto ({formProduto.imagens.length}/5)</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar items-center">
                     
                     {/* BOTAO ADICIONAR FOTO (Oculto se tiver 5) */}
                     {formProduto.imagens.length < 5 && (
                        <label className="w-24 h-24 shrink-0 border-2 border-dashed border-[#f9943b]/40 rounded-[1rem] flex flex-col items-center justify-center text-[#f9943b] hover:bg-[#f9943b]/10 hover:border-[#f9943b] cursor-pointer transition-all bg-white relative">
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                          <Plus size={24} />
                          <span className="text-[8px] font-black uppercase mt-1">Adicionar</span>
                        </label>
                     )}

                     {/* MINIATURAS DAS FOTOS SELECIONADAS */}
                     {formProduto.imagens.map((imgBase64, index) => (
                        <div key={index} className="w-24 h-24 shrink-0 relative rounded-[1rem] overflow-hidden border border-gray-100 group shadow-sm">
                           <img src={imgBase64} alt={`Upload ${index+1}`} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => removerImagem(index)} 
                             className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                             title="Remover imagem"
                           >
                             <X size={12} />
                           </button>
                        </div>
                     ))}

                  </div>
               </div>

               <button 
                  onClick={cadastrarProduto} 
                  className="w-full py-5 bg-gradient-to-r from-[#f9943b] to-[#e88127] text-white rounded-[1rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-500/30 active:scale-95 transition-all flex justify-center items-center gap-2 mt-4"
               >
                 <CheckCircle size={18} /> Publicar Anúncio
               </button>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 md:p-8 rounded-[1rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
               {formLoja.logoUrl ? (
                 <img src={formLoja.logoUrl} className="w-14 h-14 rounded-xl object-cover border border-gray-100" alt="Logo" />
               ) : (
                 <div className="p-3 bg-[#55833d]/10 rounded-xl text-[#55833d]"><Store size={28}/></div>
               )}
               <div>
                  <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-[#394158]">Painel de Controle</h1>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{formLoja.nomeLoja}</p>
               </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
               <button onClick={() => setModalLoja(true)} className="w-full sm:w-auto bg-white border border-gray-200 text-[#394158] px-6 py-4 rounded-[1rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                   <Settings size={16}/> Configurar Loja
               </button>
               <button onClick={() => setModalProduto(true)} className="w-full sm:w-auto bg-[#f9943b] text-white px-8 py-4 rounded-[1rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg hover:bg-[#55833d] transition-all">
                   <Plus size={16}/> Cadastrar Produto
               </button>
            </div>
        </div>

        <section className="bg-white p-6 md:p-8 rounded-[1rem] border border-gray-100 shadow-sm mb-8">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-black uppercase italic tracking-widest text-sm flex items-center gap-2 text-[#394158]">
                 <ShoppingCart size={16} className="text-[#f9943b]"/> Gerenciamento de Pedidos
              </h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidosGlobais.length > 0 ? pedidosGlobais.map((ped, i) => (
                 <div key={i} className="flex flex-col gap-3 p-5 bg-[#F5F2ED]/50 rounded-[1rem] border border-gray-100 hover:border-[#f9943b]/30 transition-all">
                    <div className="flex justify-between items-center">
                       <span className="text-[11px] font-black uppercase text-[#394158]">{ped.id}</span>
                       <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${
                          ped.status === 'Pendente' ? 'bg-red-100 text-red-600' :
                          ped.status === 'Preparando' ? 'bg-orange-100 text-orange-600' : 
                          ped.status === 'A Caminho' ? 'bg-blue-100 text-blue-600' : 
                          'bg-green-100 text-green-600'
                       }`}>
                          {ped.status}
                       </span>
                    </div>
                    <div>
                       <p className="text-[10px] text-gray-500 font-bold line-clamp-2">{ped.produtos?.map((p:any) => `${p.qtd}x ${p.nome}`).join(', ')}</p>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                       <span className="text-[9px] text-[#394158]/50 font-bold">{ped.data}</span>
                       <span className="text-sm font-black text-[#55833d]">R$ {Number(ped.total).toFixed(2)}</span>
                    </div>
                    
                    {/* Botões de Ação de Status */}
                    <div className="grid grid-cols-3 gap-1 mt-2 border-t border-gray-200 pt-3">
                       <button onClick={() => atualizarStatusPedido(ped.id, 'Preparando')} disabled={ped.status !== 'Pendente'} className={`text-[8px] py-2 rounded uppercase font-black transition-all ${ped.status === 'Pendente' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-gray-100 text-gray-300'}`}>Preparar</button>
                       <button onClick={() => atualizarStatusPedido(ped.id, 'A Caminho')} disabled={ped.status !== 'Preparando'} className={`text-[8px] py-2 rounded uppercase font-black transition-all ${ped.status === 'Preparando' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-300'}`}>Enviar</button>
                       <button onClick={() => atualizarStatusPedido(ped.id, 'Entregue')} disabled={ped.status !== 'A Caminho'} className={`text-[8px] py-2 rounded uppercase font-black transition-all ${ped.status === 'A Caminho' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-300'}`}>Entregue</button>
                    </div>
                 </div>
              )) : (
                 <div className="col-span-full py-10 text-center opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhum pedido recebido ainda.</p>
                 </div>
              )}
           </div>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-[1rem] border border-gray-100 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h2 className="text-lg font-black italic uppercase tracking-tighter text-[#394158]">Meus Produtos Cadastrados</h2>
              
              <div className="flex items-center gap-2 bg-[#F5F2ED] px-4 py-2 rounded-xl border border-gray-100 shadow-sm w-full md:w-auto">
                <Filter size={14} className="text-[#55833d]" />
                <select value={ordenacaoProd} onChange={(e) => setOrdenacaoProd(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer w-full text-[#394158]">
                  <option value="a_z">Ordem Alfabética (A-Z)</option>
                  <option value="z_a">Ordem Alfabética (Z-A)</option>
                  <option value="menor_preco">Menor Valor</option>
                  <option value="maior_preco">Maior Valor</option>
                </select>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {produtosExibidos.length > 0 ? (
                produtosExibidos.map((p: any) => (
                  <div key={p.id} className="bg-[#F5F2ED]/50 p-4 rounded-[1rem] shadow-sm border border-transparent hover:border-[#f9943b]/30 transition-all flex flex-col gap-3 group">
                    <div className="flex gap-4">
                      <img src={p.img} className="w-16 h-16 rounded-xl object-cover shrink-0" alt={p.nome} />
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-black text-[10px] uppercase leading-tight line-clamp-2 mb-1 text-[#394158]">{p.nome}</h4>
                        <p className="text-[#f9943b] font-black text-sm">R$ {Number(p.preco).toFixed(2)}<span className="text-[8px] ml-0.5 text-gray-400 font-bold">/{p.un}</span></p>
                      </div>
                      <button onClick={() => deletarProdutoLocal(p.id)} className="text-gray-300 hover:text-red-500 self-start p-1 transition-colors" title="Excluir produto"><Trash2 size={16}/></button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200">
                      <span className="text-[9px] font-bold text-[#394158]/50 uppercase">Estoque:</span>
                      <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                        <button onClick={() => atualizarEstoque(p.id, -1)} className="text-gray-400 hover:text-[#f9943b] px-1">-</button>
                        <span className="text-xs font-black w-6 text-center">{p.estoque}</span>
                        <button onClick={() => atualizarEstoque(p.id, 1)} className="text-gray-400 hover:text-[#55833d] px-1">+</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center opacity-40">
                   <p className="text-[10px] font-black uppercase tracking-widest">Nenhum produto cadastrado ainda.</p>
                </div>
              )}
           </div>
        </section>

      </main>

      {/* MODAL EDITAR LOJINHA */}
      {modalLoja && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#394158]/50 backdrop-blur-sm" onClick={() => setModalLoja(false)}></div>
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-6 md:p-8 border-b border-gray-100 flex justify-between items-center z-10">
              <div>
                 <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-[#394158] flex items-center gap-2">
                   <Store size={24} className="text-[#55833d]" /> Minha Loja
                 </h2>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Configure o perfil público da sua lojinha</p>
              </div>
              <button onClick={() => setModalLoja(false)} className="p-2 bg-[#F5F2ED] rounded-full text-[#394158] hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6 flex-1">
               <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                     {formLoja.logoUrl ? (
                        <img src={formLoja.logoUrl} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" alt="Logo Loja" />
                     ) : (
                        <div className="w-24 h-24 rounded-full bg-[#F5F2ED] border-4 border-white shadow-lg flex items-center justify-center text-gray-400"><Store size={32}/></div>
                     )}
                     <label className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                        <ImageIcon size={20} />
                        <span className="text-[8px] font-black uppercase mt-1">Alterar</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                     </label>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="uppercase text-gray-400 ml-4 text-[10px] font-black">Nome da Loja *</label>
                    <input type="text" value={formLoja.nomeLoja} onChange={(e) => setFormLoja({...formLoja, nomeLoja: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" placeholder="Ex: Fazenda Alvorada" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="uppercase text-gray-400 ml-4 text-[10px] font-black">Cidade</label>
                       <input type="text" value={formLoja.cidade} onChange={(e) => setFormLoja({...formLoja, cidade: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" placeholder="Ex: Aracaju" />
                     </div>
                     <div className="space-y-1.5">
                       <label className="uppercase text-gray-400 ml-4 text-[10px] font-black">Estado</label>
                       <input type="text" value={formLoja.estado} onChange={(e) => setFormLoja({...formLoja, estado: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all" placeholder="Ex: SE" />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="uppercase text-gray-400 ml-4 text-[10px] font-black">Descrição da Loja</label>
                    <textarea value={formLoja.descricao} onChange={(e) => setFormLoja({...formLoja, descricao: e.target.value})} className="w-full bg-[#F5F2ED]/50 border-2 border-transparent focus:border-[#55833d]/20 focus:bg-white p-4 rounded-2xl outline-none text-sm font-bold text-[#394158] transition-all resize-none min-h-[100px]" placeholder="Conte um pouco sobre sua loja..."></textarea>
                  </div>
               </div>

               <button onClick={salvarLoja} className="w-full py-5 bg-[#55833d] hover:bg-[#466d32] text-white rounded-[1rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all mt-4">
                  Salvar Configurações
               </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full text-center p-10 md:p-20 bg-transparent text-[#394158]/40 border-t border-gray-100 mt-10">
        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Rede Nordeste - Todos os direitos reservados.</span>
      </footer>
    </div>
  );
}