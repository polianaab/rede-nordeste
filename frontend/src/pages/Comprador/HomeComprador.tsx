import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Plus, Filter, MapPin, 
  Star, LayoutGrid, Palette, Beef, Sprout, Wheat, Carrot, Milk, Bed, Utensils, Shirt,
  MessageCircle, Heart, ChevronRight, Menu, X, BookOpen, Store, Globe, Award, Bell, ChevronLeft
} from 'lucide-react';

// --- BANCO DE DADOS POPULADO ---
const PRODUTOS_DATA = [
  { id: 1, categoria: 'Hortifruti', nome: 'Tomate Cereja Orgânico', local: 'Sítio Alvorada, SE', preco: 8.90, un: 'kg', img: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/beirario/media/uploads/produtos/foto/b3fd841dfd2c3file.png' },
  { id: 2, categoria: 'Laticínios', nome: 'Ovos Caipira (Dúzia)', local: 'Granja Girassol, BA', preco: 14.50, un: 'un', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80' },
  { id: 3, categoria: 'Grãos', nome: 'Café Especial 500g', local: 'Baturité, CE', preco: 28.90, un: 'un', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80' },
  { id: 4, categoria: 'Artesanato', nome: 'Cesto de Palha', local: 'Ilha do Ferro, AL', preco: 120.00, un: 'un', img: 'https://img.elo7.com.br/product/zoom/3996150/cesto-de-palha-com-alca-40cm-cesto-de-palha.jpg' },
  { id: 5, categoria: 'Laticínios', nome: 'Queijo Coalho Tradicional', local: 'Glória, SE', preco: 38.00, un: 'kg', img: 'https://api.ootimista.com.br/wp-content/uploads/2023/02/queijo-coalho-embrapa.jpg' },
  { id: 6, categoria: 'Carnes', nome: 'Carne Seca', local: 'Glória, SE', preco: 38.00, un: 'kg', img: 'https://revistamaiscarne.com.br/wp-content/uploads/2024/05/Brasileirissima-a-Carne-Seca-segue-conquistando-novos-publicos-2.jpg' },
  { id: 7, categoria: 'Grãos', nome: 'Feijão Verde', local: 'Aracaju, SE', preco: 15.00, un: 'kg', img: 'https://receitadaboa.com.br/wp-content/uploads/2024/09/Feijao-verde-nordestino.jpg' },
  { id: 8, categoria: 'Cama Mesa e Banho', nome: 'Kit: 1 Cobre-leito Bouti de Microfibra Ultrassonic + Porta-Travesseiros ', local: 'Aracaju, SE', preco: 179.80, un: 'un', img: 'https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22573-ogxytxlxwt0/pv/82/84/48/813d10430e46dbd0c2bc48f2a5/kit-1-cobre-leito-bouti-de-microfibra-ultrassonic-porta-travesseiros-lais-verde-large-1.png' },
  { id: 9, categoria: 'Gastronomia', nome: 'Coxinha Fit de Batata Doce com Frango e Requeijão ', local: 'Aracaju, SE', preco: 13, un: 'un', img: 'https://s2-receitas.glbimg.com/7HHi1Zrz6Dxt_G7N09l-NapN8X4=/0x0:1366x768/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2025/v/t/ceFth3Tnu97KDRgekajg/coxinha-de-galinha-com-massa-de-batata.jpg' },
  { id: 10, categoria: 'Têxtil', nome: 'Conjunto Infantil Menino', local: 'Aracaju, SE', preco: 65.90, un: 'un', img: 'https://somoscorujas.cdn.magazord.com.br/img/2025/01/produto/45394/sc19758-1.png?ims=fit-in/400x533/filters:fill(white)' },
];

const CATEGORIAS = [
  { nome: 'Todos', Icone: LayoutGrid },
  { nome: 'Artesanato', Icone: Palette },
  { nome: 'Cama Mesa e Banho', Icone: Bed },
  { nome: 'Carnes', Icone: Beef },
  { nome: 'Colheita', Icone: Sprout },
  { nome: 'Gastronomia', Icone: Utensils },
  { nome: 'Grãos', Icone: Wheat },
  { nome: 'Hortifruti', Icone: Carrot },
  { nome: 'Laticínios', Icone: Milk },
  { nome: 'Têxtil', Icone: Shirt },
];

const EMPREENDEDORAS = [
  { id: 1, nome: "Dona Maria", negocio: "Cerâmicas do Povo", territorio: "Baixo São Francisco", historia: "Mestra ceramista há 30 anos em Santana do São Francisco. Aprendeu a arte com sua avó e hoje lidera uma cooperativa de 12 mulheres que mantém viva a tradição do barro sergipano.", img: "https://cdn.awsli.com.br/2500x2500/1616/1616697/produto/109903915/e2bbd94d12.jpg" },
  { id: 2, nome: "Chef Ana Nunes", negocio: "Sabor de Mulher", territorio: "Grande Aracaju", historia: "Especialista em gastronomia afetiva, Ana utiliza apenas ingredientes de produtores locais para criar pratos que contam a história de Sergipe. Sua moqueca é famosa em toda a região.", img: "https://www.brasildefato.com.br/wp-content/uploads/2024/09/image_processing20201106-23882-1kiy8l9.jpeg" },
  { id: 3, nome: "Lúcia da Palha", negocio: "Arte Ilha do Ferro", territorio: "Sertão Ocidental", historia: "Lúcia transforma a palha de Ouricuri em peças de design moderno sem perder a essência do artesanato tradicional. Seu trabalho garante o sustento de várias famílias no sertão.", img: "https://agenciasebrae.com.br/wp-content/uploads/2026/02/artesanato-7.jpeg" },
];

export default function Home2() {
  const location = useLocation();
  const [catAtiva, setCatAtiva] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [termoPesquisado, setTermoPesquisado] = useState('');
  const [ordenacao, setOrdenacao] = useState('recomendados');
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [mulherSelecionada, setMulherSelecionada] = useState<typeof EMPREENDEDORAS[0] | null>(null);
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 8;

  const [carrinhoCount, setCarrinhoCount] = useState(() => {
    const salvo = localStorage.getItem('carrinho_count');
    return salvo ? parseInt(salvo) : 0;
  });

  useEffect(() => {
    const salvos = localStorage.getItem('favoritos_itens');
    if (salvos) setFavoritos(JSON.parse(salvos));
    
    const atualizarCarrinhoUI = () => {
      const salvo = localStorage.getItem('carrinho_count');
      setCarrinhoCount(salvo ? parseInt(salvo) : 0);
    };

    window.addEventListener('storage', atualizarCarrinhoUI);
    return () => window.removeEventListener('storage', atualizarCarrinhoUI);
  }, []);

  useEffect(() => {
    if (location.state && (location.state as any).buscaReceita) {
      const termo = (location.state as any).buscaReceita;
      setBusca(termo);
      setTermoPesquisado(termo);
      setCatAtiva('Todos');
      setPaginaAtual(1);
    }
  }, [location.state]);

  const toggleFavorito = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); e.stopPropagation();
    const novosFavoritos = favoritos.includes(id) ? favoritos.filter(favId => favId !== id) : [...favoritos, id];
    setFavoritos(novosFavoritos);
    localStorage.setItem('favoritos_itens', JSON.stringify(novosFavoritos));
    window.dispatchEvent(new Event('storage'));
  };

  const adicionarRapido = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); e.stopPropagation(); 
    const carrinhoSalvo = localStorage.getItem('carrinho_itens');
    let itens: { id: number, quantidade: number }[] = [];
    if (carrinhoSalvo) {
      try {
        itens = JSON.parse(carrinhoSalvo);
        if (!Array.isArray(itens)) itens = [];
      } catch (err) { itens = []; }
    }
    const indexExistente = itens.findIndex(item => item.id === id);
    if (indexExistente !== -1) {
      itens[indexExistente].quantidade += 1;
    } else {
      itens.push({ id, quantidade: 1 });
    }
    const totalQuantidades = itens.reduce((acc, curr) => acc + curr.quantidade, 0);
    localStorage.setItem('carrinho_itens', JSON.stringify(itens));
    localStorage.setItem('carrinho_count', totalQuantidades.toString());
    setCarrinhoCount(totalQuantidades);
    window.dispatchEvent(new Event('storage'));
  };

  const handlePesquisa = () => { 
    setTermoPesquisado(busca); 
    setCatAtiva('Todos');
    setPaginaAtual(1); 
  };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handlePesquisa(); };
  const handleCategoriaClick = (nome: string) => { 
    setCatAtiva(nome); 
    setTermoPesquisado(''); 
    setBusca(''); 
    setPaginaAtual(1);
  };

  const getProdutosFiltrados = () => {
    let filtrados = PRODUTOS_DATA.filter(p => {
      const matchCategoria = catAtiva === 'Todos' || p.categoria === catAtiva;
      const matchBusca = (() => {
        if (!termoPesquisado) return true;
        const busca = termoPesquisado.toLowerCase();
        const nome = p.nome.toLowerCase();
        if (nome.includes(busca) || busca.includes(nome)) return true;
        const termos = busca.split(/ e | ou |,/).map(t => t.trim()).filter(t => t.length > 2);
        if (termos.length > 1) {
          return termos.some(termo => nome.includes(termo) || termo.includes(nome));
        }
        return false;
      })();
      return matchCategoria && matchBusca;
    });
    if (ordenacao === 'menor_preco') {
      filtrados.sort((a, b) => a.preco - b.preco);
    } else if (ordenacao === 'maior_preco') {
      filtrados.sort((a, b) => b.preco - a.preco);
    }
    return filtrados;
  };

  const todosFiltrados = getProdutosFiltrados();
  const totalPaginas = Math.ceil(todosFiltrados.length / produtosPorPagina);
  const inicio = (paginaAtual - 1) * produtosPorPagina;
  const fim = inicio + produtosPorPagina;
  const produtosExibidos = todosFiltrados.slice(inicio, fim);

  return (
    <div className="min-h-screen bg-white text-[#394158] antialiased pb-20 font-sans">
      <header className="w-full bg-white py-4 px-4 md:px-8 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4 md:gap-8">
          <div className="flex items-center gap-4 md:gap-10 flex-shrink-0 -ml-2 md:-ml-6">
            <Link to="/home2"><img src="/assets/logo-home.png" alt="Logo" className="h-10 md:h-12" /></Link>
            <nav className="hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-widest text-[#394158]">
              <Link to="/home2" className="text-[#55833d] border-b-2 border-[#55833d] pb-1">Início</Link>
              <Link to="/receitas" className="hover:text-[#f9943b] transition-colors">Receitas</Link>
              <Link to="/noticias" className="hover:text-[#f9943b]">Notícias</Link>
            </nav>
          </div>
          <div className="relative flex-1 max-w-xl hidden md:block">
            <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={handleKeyDown} placeholder="O que procura?" className="w-full bg-[#F5F2ED] py-2.5 pl-5 pr-12 rounded-full outline-none text-sm" />
            <button onClick={handlePesquisa} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#55833d] text-white p-2 rounded-full"><Search size={16} /></button>
          </div>
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            <div className="hidden md:flex items-center gap-1">
              <Link to="/notificacoes" className="p-2.5 rounded-full hover:bg-[#f9943b] hover:text-white transition-all duration-300 text-[#394158]"><Bell size={22} /></Link>
              <Link to="/chat" className="p-2.5 rounded-full hover:bg-[#f9943b] hover:text-white transition-all duration-300 text-[#394158]"><MessageCircle size={22} /></Link>
              <Link to="/carrinho" className="p-2.5 rounded-full hover:bg-[#f9943b] hover:text-white transition-all duration-300 text-[#394158] relative group">
                <ShoppingCart size={22} />
                {carrinhoCount > 0 && <span className="absolute top-0 right-0 bg-white text-[#f9943b] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white group-hover:bg-white group-hover:text-[#f9943b] shadow-sm">{carrinhoCount}</span>}
              </Link>
              <Link to="/perfil" className="p-2.5 rounded-full hover:bg-[#f9943b] hover:text-white transition-all duration-300 text-[#394158]"><User size={22} /></Link>
            </div>
            <button onClick={() => setMenuAberto(true)} className="md:hidden p-2"><Menu size={28} /></button>
          </div>
        </div>
      </header>

      {menuAberto && (
        <div className="fixed inset-0 z-[110] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuAberto(false)}></div>
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-8 flex flex-col gap-8 animate-in slide-in-from-right duration-300">
            <button onClick={() => setMenuAberto(false)} className="self-end p-2 bg-[#F5F2ED] rounded-full text-[#394158] hover:text-red-500 transition-all"><X size={24} /></button>
            <div className="flex flex-col gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b pb-2">Navegação</p>
              <nav className="flex flex-col gap-5 text-sm font-black uppercase tracking-widest text-[#394158]">
                <Link to="/home2" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><ChevronRight size={14}/> Início</Link>
                <Link to="/receitas" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><ChevronRight size={14}/> Receitas</Link>
                <Link to="/noticias" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#f9943b]"><ChevronRight size={14}/> Notícias</Link>
                <hr className="border-gray-50 my-2" />
                <Link to="/notificacoes" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><Bell size={20}/> Notificações</Link>
                <Link to="/chat" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><MessageCircle size={20}/> Chat</Link>
                <Link to="/carrinho" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d] relative">
                  <ShoppingCart size={20}/> Carrinho 
                  {carrinhoCount > 0 && <span className="bg-[#f9943b] text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">{carrinhoCount}</span>}
                </Link>
                <Link to="/perfil" onClick={() => setMenuAberto(false)} className="flex items-center gap-4 hover:text-[#55833d]"><User size={20}/> Meu Perfil</Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {mulherSelecionada && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setMulherSelecionada(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[1rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setMulherSelecionada(null)} className="absolute top-6 right-6 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"><X size={20} /></button>
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img src={mulherSelecionada.img} className="w-full h-full object-cover" alt={mulherSelecionada.nome} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#55833d]/60 to-transparent"></div>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[#55833d] mb-2"><MapPin size={14} /><span className="text-[10px] font-black uppercase tracking-widest">{mulherSelecionada.territorio}</span></div>
                <h2 className="text-2xl font-black text-[#394158] mb-1">{mulherSelecionada.nome}</h2>
                <span className="text-[#f9943b] font-black italic uppercase text-xs mb-6">{mulherSelecionada.negocio}</span>
                <div className="bg-[#F5F2ED] p-5 rounded-3xl mb-8">
                  <div className="flex items-center gap-2 mb-3 text-[#394158]/50 uppercase font-black text-[9px]"><BookOpen size={12} /> Nossa História</div>
                  <p className="text-sm text-[#394158] leading-relaxed italic">"{mulherSelecionada.historia}"</p>
                </div>
                <button onClick={() => setMulherSelecionada(null)} className="w-full bg-[#55833d] text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3"><Store size={16} /> Ver Loja da Vendedora</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-10">
        <div className="relative w-full mb-8 md:hidden group">
          <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={handleKeyDown} placeholder="O que procura?" className="w-full bg-white py-3 pl-6 pr-12 rounded-full border border-gray-100 shadow-sm outline-none text-sm font-medium text-[#394158]" />
          <button onClick={handlePesquisa} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#55833d] text-white p-2 rounded-full active:scale-95 transition-all"><Search size={16}/></button>
        </div>

        <section className="w-full max-w-6xl mb-12 md:mb-16 bg-[#fededf] p-4 md:p-8 rounded-[2rem] md:rounded-[1rem] border border-[#fededf] mx-auto shadow-xl">
            <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-4 text-[#394158]">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-white/20 rounded-xl"><Star size={18} className="fill-[#FFCD0D] text-[#FFCD0D]" /></div>
                    <h2 className="text-sm md:text-xl font-black italic uppercase tracking-widest">Empreendedoras de Sergipe</h2>
                </div>
                <button className="text-[10px] font-black uppercase hover:underline">Ver todas</button>
            </div>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 no-scrollbar px-2 md:px-4">
                {EMPREENDEDORAS.map(mulher => (
                    <div key={mulher.id} onClick={() => setMulherSelecionada(mulher)} className="min-w-[240px] md:min-w-[280px] bg-white rounded-[1rem] p-3 shadow-lg flex items-center gap-3 group cursor-pointer hover:bg-[#aab2c1] transition-all duration-500 border border-white">
                        <img src={mulher.img} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-[#394158]/20 transition-colors" alt={mulher.nome} />
                        <div className="flex flex-col">
                            <h3 className="text-xs md:text-sm font-black uppercase text-[#394158] group-hover:text-white transition-colors leading-tight">{mulher.nome}</h3>
                            <span className="text-[8px] md:text-[10px] font-bold text-[#394158]/60 group-hover:text-white/80 transition-colors uppercase italic">{mulher.negocio}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="w-full max-w-7xl mx-auto bg-gray-100/50 p-4 md:p-10 rounded-[1rem] border border-gray-200 shadow-inner mb-12">
          <div className="mb-12">
            <h2 className="text-xs md:text-xl font-black uppercase tracking-widest italic mb-10 text-[#394158]">Categorias</h2>
            {/* GRID DE CATEGORIAS ATUALIZADO */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-4">
              {CATEGORIAS.map(cat => (
                <button 
                  key={cat.nome} 
                  onClick={() => handleCategoriaClick(cat.nome)} 
                  className="flex flex-col items-center gap-2 group w-full"
                >
                  <div className={`w-full aspect-[4/3] md:aspect-square max-w-[80px] rounded-xl md:rounded-2xl flex items-center justify-center border transition-all shadow-sm ${catAtiva === cat.nome ? 'bg-[#f9943b] border-[#f9943b] text-white scale-110' : 'bg-white border-gray-200 group-hover:border-[#394158]'}`}>
                    <cat.Icone size={20} />
                  </div>
                  <span className={`text-[8px] md:text-[9px] font-black uppercase text-center leading-tight ${catAtiva === cat.nome ? 'text-[#394158]' : 'text-[#394158]/40'}`}>{cat.nome}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <h2 className="text-xl font-black italic uppercase text-[#394158]">{catAtiva !== "Todos" ? catAtiva : "Nossos Produtos"}</h2>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm self-start">
                <Filter size={14} className="text-[#55833d]" />
                <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer">
                  <option value="recomendados">Recomendados</option>
                  <option value="menor_preco">Menor Preço</option>
                  <option value="maior_preco">Maior Preço</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-8">
              {produtosExibidos.map(prod => (
                <div key={prod.id} className="relative bg-white p-2 md:p-5 rounded-[1rem] shadow-xl flex flex-col group border border-transparent hover:border-[#55833d]/20 transition-all">
                  <button onClick={(e) => toggleFavorito(e, prod.id)} className="absolute top-3 left-3 md:top-8 md:left-8 z-20 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform"><Heart size={14} className={favoritos.includes(prod.id) ? "fill-[#802D44] text-[#802D44]" : "text-gray-400"} /></button>
                  <div className="relative overflow-hidden rounded-[1rem] mb-3 md:mb-4 aspect-square">
                    <Link to={`/produto/${prod.id}`}><img src={prod.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={prod.nome} /></Link>
                    <button onClick={(e) => adicionarRapido(e, prod.id)} className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-[#f9943b] text-white p-1.5 md:p-2.5 rounded-full shadow-xl z-10 active:scale-90"><Plus size={14} /></button>
                  </div>
                  <span className="text-[6px] md:text-[9px] font-black uppercase text-[#55833d] mb-1">{prod.categoria}</span>
                  <Link to={`/produto/${prod.id}`}><h3 className="font-bold text-[#394158] text-[8px] md:text-sm leading-tight mb-1 line-clamp-1 hover:text-[#55833d] transition-colors">{prod.nome}</h3></Link>
                  <div className="flex items-center gap-1 text-[#394158]/50 mb-2 uppercase font-bold text-[6px] md:text-[9px]"><MapPin size={8} /> {prod.local}</div>
                  <div className="mt-auto pt-2 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] md:text-lg font-black text-[#394158]">R$ {prod.preco.toFixed(2)}<span className="text-[7px] md:text-[10px] opacity-40 ml-1">/{prod.un}</span></span>
                    <Link to={`/produto/${prod.id}`} className="hidden md:block text-[9px] font-black uppercase bg-[#394158] text-white px-4 py-1.5 rounded-xl hover:bg-[#55833d]">Detalhes</Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-gray-100">
                <button 
                  onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className={`p-2 rounded-full transition-all ${paginaAtual === 1 ? 'text-gray-200' : 'hover:bg-white text-[#394158] shadow-sm'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPaginaAtual(i + 1)}
                    className={`w-8 h-8 rounded-full text-[10px] font-black transition-all ${
                      paginaAtual === i + 1 
                      ? 'bg-[#394158] text-white shadow-md' 
                      : 'bg-white text-[#394158]/40 hover:bg-gray-200 shadow-sm'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className={`p-2 rounded-full transition-all ${paginaAtual === totalPaginas ? 'text-gray-200' : 'hover:bg-white text-[#394158] shadow-sm'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto border-t border-gray-50 pt-16 bg-gray-100/50 p-4 md:p-10 rounded-[1rem] border border-gray-200 shadow-inner mb-16">
          <h2 className="text-xl font-black italic uppercase text-[#394158] mb-10 tracking-widest">Continue Comprando</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
            {PRODUTOS_DATA.slice(0, 3).map(prod => (
              <div key={prod.id} className="bg-white p-4 rounded-[1rem] shadow-sm flex items-center gap-4 group border border-gray-100 hover:border-[#55833d]/20 transition-all">
                <Link to={`/produto/${prod.id}`}><img src={prod.img} className="w-16 h-16 md:w-24 md:h-24 rounded-xl object-cover" alt={prod.nome} /></Link>
                <div>
                  <h3 className="font-bold text-xs text-[#394158] leading-tight line-clamp-1">{prod.nome}</h3>
                  <p className="text-sm font-black text-[#f9943b] mt-1">R$ {prod.preco.toFixed(2)}</p>
                  <button onClick={(e) => adicionarRapido(e, prod.id)} className="text-[9px] font-black uppercase text-[#55833d] mt-1 hover:underline">Adicionar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full text-center p-10 md:p-20 bg-gray-50 text-[#394158]/40 border-t border-gray-100">
        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Rede Nordeste - Todos os direitos reservados.</span>
      </footer>
    </div>
  );
}