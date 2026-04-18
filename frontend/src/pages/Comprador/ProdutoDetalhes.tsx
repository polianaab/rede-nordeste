import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, MapPin, Store, 
  Info, ShieldCheck, Truck, Minus, Plus, CheckCircle2 
} from 'lucide-react';

// 1. LISTA DE PRODUTOS COMPLETA (Igual à da Home2)
const PRODUTOS_DATA = [
  { id: 1, categoria: 'Hortifruti', nome: 'Tomate Cereja Orgânico', local: 'Sítio Alvorada, SE', preco: 8.90, un: 'kg', img: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=800&q=80', desc: 'Tomates cultivados sem agrotóxicos, colhidos no dia.' },
  { id: 2, categoria: 'Laticínios', nome: 'Ovos Caipira (Dúzia)', local: 'Granja Girassol, BA', preco: 14.50, un: 'un', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80', desc: 'Ovos de galinhas criadas soltas, ricas em nutrientes.' },
  { id: 3, categoria: 'Grãos', nome: 'Café Especial 500g', local: 'Baturité, CE', preco: 28.90, un: 'un', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80', desc: 'Café arábica selecionado das montanhas do Ceará.' },
  { id: 4, categoria: 'Colheita', nome: 'Mel Silvestre Puro', local: 'Picos, PI', preco: 45.00, un: 'un', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80', desc: 'Mel 100% puro extraído da flora nativa piauiense.' },
  { id: 5, categoria: 'Carnes', nome: 'Carne de Sol de Primeira', local: 'Itabaiana, SE', preco: 58.90, un: 'kg', img: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=400&q=80', desc: 'Corte artesanal curado ao sol, tradição sergipana.' },
  { id: 6, categoria: 'Hortifruti', nome: 'Cesta de Frutas', local: 'Aracaju, SE', preco: 35.00, un: 'un', img: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80', desc: 'Mix de frutas tropicais da estação.' },
  { id: 7, categoria: 'Artesanais', nome: 'Cesto de Palha', local: 'Ilha do Ferro, AL', preco: 120.00, un: 'un', img: 'https://images.unsplash.com/photo-1511211065450-435422874834?auto=format&fit=crop&w=400&q=80', desc: 'Artesanato feito à mão por comunidades ribeirinhas.' },
  { id: 8, categoria: 'Laticínios', nome: 'Queijo Coalho Tradicional', local: 'Glória, SE', preco: 38.00, un: 'kg', img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80', desc: 'Queijo típico do sertão, perfeito para grelhar.' },
  { id: 9, categoria: 'Grãos', nome: 'Feijão Verde', local: 'Lagarto, SE', preco: 12.00, un: 'kg', img: 'https://images.unsplash.com/photo-1551462147-ff29053fad31?auto=format&fit=crop&w=400&q=80', desc: 'Feijão debulhado na hora, ideal para o baião de dois.' },
  { id: 10, categoria: 'Colheita', nome: 'Castanha de Caju', local: 'Pacajus, CE', preco: 22.00, un: '250g', img: 'https://images.unsplash.com/photo-1536620453303-363d6b63f53c?auto=format&fit=crop&w=400&q=80', desc: 'Castanhas torradas artesanalmente.' },
];

export default function ProdutoDetalhes() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  
  // 2. BUSCA DINÂMICA DO PRODUTO
  const produto = PRODUTOS_DATA.find(p => p.id === Number(id));

  const [quantidade, setQuantidade] = useState(1);
  const [feedbackCompra, setFeedbackCompra] = useState(false);

  // Fallback caso o produto não seja encontrado
  if (!produto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-black uppercase tracking-widest opacity-40">
        <p>Produto não encontrado</p>
        <button onClick={() => navigate('/home2')} className="mt-4 text-xs underline">Voltar para Home</button>
      </div>
    );
  }

  const handleAumentar = () => setQuantidade(prev => prev + 1);
  const handleDiminuir = () => {
    if (quantidade > 1) setQuantidade(prev => prev - 1);
  };

  const handleAdicionarAoCarrinho = () => {
    const carrinhoAtual = localStorage.getItem('carrinho_count') || '0';
    const novoTotal = parseInt(carrinhoAtual) + quantidade;
    localStorage.setItem('carrinho_count', novoTotal.toString());

    window.dispatchEvent(new Event('storage'));

    setFeedbackCompra(true);
    setTimeout(() => setFeedbackCompra(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased">
      <header className="w-full bg-white py-6 px-8 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Detalhes do Produto</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section className="relative">
          <div className="sticky top-32">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={produto.img} 
                alt={produto.nome} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-6 left-6 bg-[#55833d] text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg">
              {produto.categoria}
            </div>
          </div>
        </section>

        <section className="flex flex-col space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#55833d]">
              <MapPin size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{produto.local}</span>
            </div>
            <h2 className="text-4xl font-black italic uppercase tracking-tight leading-none mb-4">
              {produto.nome}
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#f9943b]">R$ {produto.preco.toFixed(2)}</span>
              <span className="text-sm font-bold opacity-40 uppercase">/ por {produto.un}</span>
            </div>
          </div>

          <div className="bg-white/50 p-6 rounded-[2rem] border border-white">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">
              <Info size={14} /> Descrição
            </h3>
            <p className="text-sm leading-relaxed font-medium">
              {produto.desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <img 
                src="https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=150" 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-50" 
                alt="Produtor"
              />
              <div>
                <span className="text-[9px] font-black uppercase text-[#55833d]">Vendedor Parceiro</span>
                <h4 className="font-bold text-[#394158]">Produtor Rural Sergipano</h4>
                <div className="flex items-center gap-1 text-[9px] font-bold opacity-40">
                  <Store size={10} /> Disponível via Rede Nordeste
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
                <button onClick={handleDiminuir} className="p-2 hover:bg-[#F5F2ED] rounded-xl transition-colors">
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-lg">{quantidade}</span>
                <button onClick={handleAumentar} className="p-2 hover:bg-[#F5F2ED] rounded-xl transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                Disponível em Estoque
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAdicionarAoCarrinho}
                disabled={feedbackCompra}
                className={`flex-1 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                  feedbackCompra 
                  ? 'bg-[#55833d] text-white scale-[0.98]' 
                  : 'bg-[#394158] text-white hover:bg-[#f9943b]'
                }`}
              >
                {feedbackCompra ? (
                  <>
                    <CheckCircle2 size={18} /> Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}