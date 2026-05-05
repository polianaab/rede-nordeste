import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, MapPin, Store, 
  Info, Minus, Plus, CheckCircle2, ChevronLeft, ChevronRight 
} from 'lucide-react';

// 1. LISTA DE PRODUTOS ATUALIZADA (Sincronizada com a Home)
const PRODUTOS_DATA = [
  { id: 1, categoria: 'Hortifruti', nome: 'Tomate Cereja Orgânico', local: 'Sítio Alvorada, SE', preco: 8.90, un: 'kg', estoque: 45, images: ['https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/beirario/media/uploads/produtos/foto/b3fd841dfd2c3file.png'], desc: 'Tomates cereja cultivados de forma 100% orgânica no Sítio Alvorada. Sabor adocicado e frescor garantido.' },
  { id: 2, categoria: 'Laticínios', nome: 'Ovos Caipira (Dúzia)', local: 'Granja Girassol, BA', preco: 14.50, un: 'un', estoque: 20, images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80'], desc: 'Ovos caipira legítimos. Galinhas criadas soltas com alimentação natural.' },
  { id: 3, categoria: 'Grãos', nome: 'Café Especial 500g', local: 'Baturité, CE', preco: 28.90, un: 'un', estoque: 15, images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80'], desc: 'Café especial das serras cearenses, notas de chocolate e caramelo.' },
  { id: 4, categoria: 'Artesanato', nome: 'Cesto de Palha', local: 'Ilha do Ferro, AL', preco: 120.00, un: 'un', estoque: 5, images: ['https://img.elo7.com.br/product/zoom/3996150/cesto-de-palha-com-alca-40cm-cesto-de-palha.jpg'], desc: 'Cesto tecido à mão com palha de Ouricuri, tradição da Ilha do Ferro.' },
  { id: 5, categoria: 'Laticínios', nome: 'Queijo Coalho Tradicional', local: 'Glória, SE', preco: 38.00, un: 'kg', estoque: 12, images: ['https://api.ootimista.com.br/wp-content/uploads/2023/02/queijo-coalho-embrapa.jpg'], desc: 'O verdadeiro queijo coalho do sertão sergipano. Ideal para assar.' },
  { id: 6, categoria: 'Carnes', nome: 'Carne Seca', local: 'Glória, SE', preco: 38.00, un: 'kg', estoque: 25, images: ['https://revistamaiscarne.com.br/wp-content/uploads/2024/05/Brasileirissima-a-Carne-Seca-segue-conquistando-novos-publicos-2.jpg'], desc: 'Carne seca artesanal, curada com perfeição no clima do sertão.' },
  { id: 7, categoria: 'Grãos', nome: 'Feijão Verde', local: 'Aracaju, SE', preco: 15.00, un: 'kg', estoque: 30, images: ['https://receitadaboa.com.br/wp-content/uploads/2024/09/Feijao-verde-nordestino.jpg'], desc: 'Feijão verde fresquinho, debulhado no dia da entrega.' },
  { id: 8, categoria: 'Cama Mesa e Banho', nome: 'Kit Cobre-leito Bouti', local: 'Aracaju, SE', preco: 179.80, un: 'un', estoque: 8, images: ['https://adaptive-images.uooucdn.com.br/ik-seo/tr:w-1100,h-1594,c-at_max,pr-true,q-80/a22573-ogxytxlxwt0/pv/82/84/48/813d10430e46dbd0c2bc48f2a5/kit-1-cobre-leito-bouti-de-microfibra-ultrassonic-porta-travesseiros-lais-verde-large-1.png'], desc: 'Conforto e elegância para o seu quarto com microfibra de alta qualidade.' },
  { id: 9, categoria: 'Gastronomia', nome: 'Coxinha Fit de Batata Doce', local: 'Aracaju, SE', preco: 13.00, un: 'un', estoque: 50, images: ['https://s2-receitas.glbimg.com/7HHi1Zrz6Dxt_G7N09l-NapN8X4=/0x0:1366x768/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2025/v/t/ceFth3Tnu97KDRgekajg/coxinha-de-galinha-com-massa-de-batata.jpg'], desc: 'Opção saudável e deliciosa, recheada com frango e requeijão light.' },
  { id: 10, categoria: 'Têxtil', nome: 'Conjunto Infantil Menino', local: 'Aracaju, SE', preco: 65.90, un: 'un', estoque: 10, images: ['https://somoscorujas.cdn.magazord.com.br/img/2025/01/produto/45394/sc19758-1.png?ims=fit-in/400x533/filters:fill(white)'], desc: 'Roupa infantil confortável para o dia a dia, tecido 100% algodão.' },
];

export default function ProdutoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const produto = PRODUTOS_DATA.find(p => p.id === Number(id));

  const [quantidade, setQuantidade] = useState(1);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [feedbackCompra, setFeedbackCompra] = useState(false);

  if (!produto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-black uppercase tracking-widest opacity-40">
        <p>Produto não encontrado</p>
        <button onClick={() => navigate('/home2')} className="mt-4 text-xs underline">Voltar para Home</button>
      </div>
    );
  }

  const handleAumentar = () => {
    if (quantidade < produto.estoque) setQuantidade(prev => prev + 1);
  };
  
  const handleDiminuir = () => {
    if (quantidade > 1) setQuantidade(prev => prev - 1);
  };

  const handleAdicionarAoCarrinho = () => {
    const itensSalvos = localStorage.getItem('carrinho_itens');
    let itens = [];
    
    if (itensSalvos) {
      try {
        itens = JSON.parse(itensSalvos);
      } catch (e) { itens = []; }
    }

    const indexExistente = itens.findIndex((i: any) => i.id === produto.id);

    if (indexExistente !== -1) {
      itens[indexExistente].quantidade += quantidade;
    } else {
      itens.push({ id: produto.id, quantidade: quantidade, selecionado: true });
    }

    localStorage.setItem('carrinho_itens', JSON.stringify(itens));
    const totalCount = itens.reduce((acc: number, curr: any) => acc + curr.quantidade, 0);
    localStorage.setItem('carrinho_count', totalCount.toString());

    window.dispatchEvent(new Event('storage'));

    setFeedbackCompra(true);
    setTimeout(() => setFeedbackCompra(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] antialiased pb-20">
      <header className="w-full bg-white py-6 px-8 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Detalhes do Produto</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* GALERIA DE FOTOS COM BOLINHAS */}
        <section className="relative">
          <div className="sticky top-32">
            <div className="relative aspect-square rounded-[1rem] overflow-hidden shadow-2xl border-8 border-white group">
              <img 
                src={produto.images[fotoAtiva]} 
                alt={produto.nome} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Bolinhas Flutuantes (Somente se houver mais de uma foto) */}
              {produto.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/10 backdrop-blur-md rounded-full">
                  {produto.images.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFotoAtiva(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        fotoAtiva === idx ? 'bg-white w-6' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="absolute top-6 left-6 bg-[#55833d] text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg">
                {produto.categoria}
              </div>
            </div>
          </div>
        </section>

        {/* INFORMAÇÕES */}
        <section className="flex flex-col space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#55833d]">
              <MapPin size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{produto.local}</span>
            </div>
            <h2 className="text-4xl font-black italic uppercase tracking-tight leading-tight mb-4">
              {produto.nome}
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#f9943b]">R$ {produto.preco.toFixed(2)}</span>
              <span className="text-sm font-bold opacity-40 uppercase">/ por {produto.un}</span>
            </div>
          </div>

          {/* SOBRE O PRODUTO */}
          <div className="bg-white/50 p-6 rounded-[1rem] border border-white">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">
              <Info size={14} /> Sobre o Produto
            </h3>
            <p className="text-sm leading-relaxed font-medium italic opacity-80">
              "{produto.desc}"
            </p>
          </div>

          {/* ESTOQUE E QUANTIDADE */}
          <div className="bg-white p-8 rounded-[1rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1">
                  Status
                </span>
                <div className="flex items-center gap-2 text-[#55833d] font-bold">
                  <CheckCircle2 size={16} />
                  <span>{produto.estoque} {produto.un} em estoque</span>
                </div>
              </div>

              <div className="flex items-center bg-[#F5F2ED] rounded-2xl p-1.5 border border-gray-200">
                <button 
                  onClick={handleDiminuir} 
                  className="p-2.5 hover:bg-white rounded-xl transition-all active:scale-90"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-xl">{quantidade}</span>
                <button 
                  onClick={handleAumentar} 
                  className={`p-2.5 rounded-xl transition-all active:scale-90 ${
                    quantidade >= produto.estoque ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white'
                  }`}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button 
              onClick={handleAdicionarAoCarrinho}
              disabled={feedbackCompra}
              className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                feedbackCompra 
                ? 'bg-[#55833d] text-white' 
                : 'bg-[#394158] text-white hover:bg-[#f9943b]'
              }`}
            >
              {feedbackCompra ? (
                <> <CheckCircle2 size={18} /> Adicionado!</>
              ) : (
                <> <ShoppingCart size={18} /> Adicionar à Cesta</>
              )}
            </button>
          </div>

          {/* VENDEDOR */}
          <div className="bg-white p-6 rounded-[1rem] shadow-sm flex items-center justify-between border border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F2ED] flex items-center justify-center text-[#55833d]">
                <Store size={28} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-[#55833d]">Produtor Regional</span>
                <h4 className="font-bold text-[#394158]">Rede Nordeste Parceiro</h4>
                <div className="flex items-center gap-1 text-[9px] font-bold opacity-40">
                  Verificado pela Rede Nordeste
                </div>
              </div>
            </div>
            <button className="text-[10px] font-black uppercase text-[#f9943b] hover:underline">Ver Perfil</button>
          </div>
        </section>
      </main>
    </div>
  );
}