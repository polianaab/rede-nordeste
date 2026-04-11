import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Plus, Filter, MapPin, 
  Star, LayoutGrid, Palette, Beef, Sprout, Wheat, Carrot, Milk 
} from 'lucide-react';

// --- BANCO DE DADOS POPULADO ---
const PRODUTOS_DATA = [
  { id: 1, categoria: 'Hortifruti', nome: 'Tomate Cereja Orgânico', local: 'Sítio Alvorada, SE', preco: 8.90, un: 'kg', img: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=400&q=80' },
  { id: 2, categoria: 'Laticínios', nome: 'Ovos Caipira (Dúzia)', local: 'Granja Girassol, BA', preco: 14.50, un: 'un', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80' },
  { id: 3, categoria: 'Grãos', nome: 'Café Especial 500g', local: 'Baturité, CE', preco: 28.90, un: 'un', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80' },
  { id: 4, categoria: 'Colheita', nome: 'Mel Silvestre Puro', local: 'Picos, PI', preco: 45.00, un: 'un', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80' },
  { id: 5, categoria: 'Carnes', nome: 'Carne de Sol de Primeira', local: 'Itabaiana, SE', preco: 58.90, un: 'kg', img: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=400&q=80' },
  { id: 6, categoria: 'Hortifruti', nome: 'Cesta de Frutas', local: 'Aracaju, SE', preco: 35.00, un: 'un', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80' },
  { id: 7, categoria: 'Artesanais', nome: 'Cesto de Palha', local: 'Ilha do Ferro, AL', preco: 120.00, un: 'un', img: 'https://images.unsplash.com/photo-1511211065450-435422874834?auto=format&fit=crop&w=400&q=80' },
  { id: 8, categoria: 'Laticínios', nome: 'Queijo Coalho Tradicional', local: 'Glória, SE', preco: 38.00, un: 'kg', img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80' },
  { id: 9, categoria: 'Grãos', nome: 'Feijão Verde', local: 'Lagarto, SE', preco: 12.00, un: 'kg', img: 'https://images.unsplash.com/photo-1551462147-ff29053fad31?auto=format&fit=crop&w=400&q=80' },
  { id: 10, categoria: 'Colheita', nome: 'Castanha de Caju', local: 'Pacajus, CE', preco: 22.00, un: '250g', img: 'https://images.unsplash.com/photo-1536620453303-363d6b63f53c?auto=format&fit=crop&w=400&q=80' },
];

const CATEGORIAS = [
  { nome: 'Todos', Icone: LayoutGrid },
  { nome: 'Artesanais', Icone: Palette },
  { nome: 'Carnes', Icone: Beef },
  { nome: 'Colheita', Icone: Sprout },
  { nome: 'Grãos', Icone: Wheat },
  { nome: 'Hortifruti', Icone: Carrot },
  { nome: 'Laticínios', Icone: Milk },
];

export default function Home2() {
  const [catAtiva, setCatAtiva] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [termoPesquisado, setTermoPesquisado] = useState('');
  const [ordenacao, setOrdenacao] = useState('recomendados');
  const [carrinhoCount, setCarrinhoCount] = useState(0);

  const handlePesquisa = () => { setTermoPesquisado(busca); setCatAtiva('Todos'); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handlePesquisa(); };
  const handleCategoriaClick = (nome: string) => { setCatAtiva(nome); setTermoPesquisado(''); setBusca(''); };

  const getProdutosProcessados = () => {
    let filtrados = PRODUTOS_DATA.filter(p => {
      const matchCategoria = catAtiva === 'Todos' || p.categoria === catAtiva;
      const matchBusca = p.nome.toLowerCase().includes(termoPesquisado.toLowerCase());
      return matchCategoria && matchBusca;
    });

    // Lógica de Ordenação Atualizada
    if (ordenacao === 'menor_preco') filtrados.sort((a, b) => a.preco - b.preco);
    if (ordenacao === 'maior_preco') filtrados.sort((a, b) => b.preco - a.preco);
    if (ordenacao === 'localizacao') filtrados.sort((a, b) => a.local.localeCompare(b.local));

    return filtrados;
  };

  const produtosExibidos = getProdutosProcessados();

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased pb-20 font-sans">
      
      {/* NAVBAR */}
      <header className="w-full bg-white py-4 px-8 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link to="/home2"><img src="/assets/logo-home.png" alt="Logo" className="h-14" /></Link>
            <nav className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <Link to="/home2" className="text-[#55833d] border-b-2 border-[#55833d] pb-1">Início</Link>
              <Link to="/receitas" className="hover:text-[#f9943b] transition-colors">Receitas</Link>
              <Link to="/noticias" className="hover:text-[#f9943b]">Notícias</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <ShoppingCart size={22} />
              {carrinhoCount > 0 && <span className="absolute -top-2 -right-2 bg-[#f9943b] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{carrinhoCount}</span>}
            </div>
            <User size={22} className="cursor-pointer hover:text-[#55833d]" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pt-12 flex flex-col items-center">
        
        {/* BUSCA */}
        <div className="relative w-full max-w-5xl mb-16 group">
          <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={handleKeyDown} placeholder="O que você está procurando hoje?" className="w-full bg-white py-4 pl-8 pr-16 rounded-full border border-gray-100 shadow-sm outline-none text-base font-medium text-[#394158]" />
          <button onClick={handlePesquisa} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#55833d] text-white p-3 rounded-full active:scale-95 transition-all"><Search size={18} strokeWidth={2.5} /></button>
        </div>

        {/* CATEGORIAS */}
        <section className="w-full mb-16">
          <h2 className="text-sm font-black uppercase tracking-widest italic mb-10 text-[#394158]">Categorias</h2>
          <div className="w-full flex justify-between items-start">
            {CATEGORIAS.map(cat => {
              const IconeCat = cat.Icone;
              const isAtivo = catAtiva === cat.nome;
              return (
                <button key={cat.nome} onClick={() => handleCategoriaClick(cat.nome)} className="flex flex-col items-center gap-3 group transition-all">
                  <div className={`w-23 h-13 rounded-2xl flex items-center justify-center border transition-all duration-300 ${isAtivo ? 'bg-[#f9943b] border-[#f9943b] text-white shadow-lg scale-105' : 'bg-white border-gray-100 group-hover:border-[#394158]'}`}>
                    <IconeCat size={24} strokeWidth={1.5} color={isAtivo ? "#FFFFFF" : "#394158"} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider text-center ${isAtivo ? 'text-[#394158]' : 'text-[#394158]/40'}`}>{cat.nome}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* BARRA DE FILTRO / ORDENAÇÃO */}
        <section className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            {catAtiva === "Todos" && termoPesquisado === "" ? (
              <div className="flex items-center gap-3 text-[#f9943b]">
                <Star size={20} className="fill-current" />
                <h2 className="text-xl font-black italic uppercase tracking-widest text-[#394158]">Destaques da Semana</h2>
              </div>
            ) : (
              <h2 className="text-xl font-black italic uppercase tracking-widest">
                {catAtiva !== "Todos" ? catAtiva : `Busca: ${termoPesquisado}`}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm">
            <Filter size={16} className="text-[#55833d]" />
            <span className="text-[9px] font-black uppercase opacity-40">Ordenar por:</span>
            <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer text-[#394158]">
              <option value="recomendados">Recomendados</option>
              <option value="menor_preco">Menor Preço</option>
              <option value="maior_preco">Maior Preço</option>
              <option value="localizacao">Localização (Estado)</option>
            </select>
          </div>
        </section>

        {/* GRADE DE PRODUTOS */}
        <section className="w-full mb-20">
          {produtosExibidos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {produtosExibidos.map(prod => (
                <div key={prod.id} className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-gray-200/30 flex flex-col group border border-transparent hover:border-[#55833d]/10 transition-all hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-[2rem] mb-4 aspect-square">
                    <img src={prod.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={prod.nome} />
                    <button onClick={() => setCarrinhoCount(prev => prev + 1)} className="absolute bottom-4 right-4 bg-[#f9943b] text-white p-2.5 rounded-full shadow-xl"><Plus size={18} /></button>
                  </div>
                  <span className="text-[9px] font-black uppercase text-[#55833d] mb-1">{prod.categoria}</span>
                  <h3 className="font-bold text-[#394158] text-sm leading-tight mb-1">{prod.nome}</h3>
                  <div className="flex items-center gap-1 text-[#394158]/50 mb-4 uppercase font-bold text-[9px]"><MapPin size={10} /> {prod.local}</div>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-lg font-black text-[#394158]">R$ {prod.preco.toFixed(2)}</span>
                    <button className="text-[9px] font-black uppercase bg-[#394158] text-white px-5 py-2 rounded-xl">Detalhes</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full py-20 text-center text-[#394158]/40 font-bold italic tracking-widest uppercase">Nenhum produto encontrado.</div>
          )}
        </section>

        {/* CONTINUE COMPRANDO */}
        <section className="w-full mb-16 border-t border-gray-100 pt-16">
          <h2 className="text-xl font-black italic uppercase tracking-widest text-[#394158] mb-10">Continue Comprando</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUTOS_DATA.slice(0, 3).map(prod => (
              <div key={prod.id} className="bg-white p-4 rounded-[2rem] shadow-md border border-gray-100 flex items-center gap-4 group hover:shadow-lg transition-all">
                <img src={prod.img} className="w-24 h-24 rounded-2xl object-cover" alt={prod.nome} />
                <div>
                  <h3 className="font-bold text-sm text-[#394158]">{prod.nome}</h3>
                  <p className="text-sm font-black text-[#f9943b] mt-1">R$ {prod.preco.toFixed(2)}</p>
                  <button onClick={() => setCarrinhoCount(prev => prev + 1)} className="mt-2 text-[9px] font-black uppercase text-[#55833d]">Adicionar</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HISTÓRICO */}
        <section className="w-full mb-16">
          <h2 className="text-xl font-black italic uppercase tracking-widest mb-8 text-[#394158]">Seu Histórico de Navegação</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
            {PRODUTOS_DATA.slice(6, 10).map(prod => (
              <div key={prod.id} className="min-w-[180px] bg-white p-4 rounded-[2.5rem] border border-gray-100 text-center shadow-sm group">
                <div className="overflow-hidden rounded-[2rem] mb-3"><img src={prod.img} className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.nome} /></div>
                <h3 className="font-bold text-[10px] text-[#394158] uppercase truncate px-2 tracking-widest">{prod.nome}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="w-full text-center p-10 bg-gray-50 text-[#394158]/20">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Rede Nordeste</span>
      </footer>
    </div>
  );
}