import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, ShoppingBag, ArrowRight, MousePointerClick, 
  Truck, PackageCheck, Leaf, Target 
} from 'lucide-react';

// --- ESTRUTURA DE DADOS MANTIDA ---
const SLIDES_DESTAQUE = [
  { 
    id: 1, 
    tipo: "SAFRA DO MÊS",
    titulo: "A melhor época para comprar manga",
    subtitulo: "Produtos frescos e com preços especiais direto do produtor.",
    img: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000", 
    corDestaque: "text-[#f9943b]" 
  },
  { 
    id: 2, 
    tipo: "HISTÓRIA DE SUCESSO",
    titulo: "Como o seu João dobrou a renda com os morangos",
    subtitulo: "Conheça a trajetória do agricultor que apostou na venda direta.",
    img: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop", 
    corDestaque: "text-[#55833d]" 
  },
  { 
    id: 3, 
    tipo: "PRÊMIO DE METAS ALCANÇADAS",
    titulo: "Dona Maria ganhou em primeiro lugar nas vendas de artesanato",
    subtitulo: "Valorizamos o esforço de quem leva a cultura nordestina adiante.",
    img: "https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
    corDestaque: "text-[#C4D663]" 
  }
];

const CATEGORIAS_DB = [
  { nome: 'Hortifruti', cor: 'bg-[#55833d]', icon: 'https://cdn-icons-png.flaticon.com/512/2329/2329903.png' },
  { nome: 'Laticínios', cor: 'bg-[#C4D663]', icon: 'https://cdn-icons-png.flaticon.com/512/2674/2674486.png' },
  { nome: 'Grãos e Farinhas', cor: 'bg-[#BC5434]', icon: 'https://cdn-icons-png.flaticon.com/512/1147/1147560.png' },
  { nome: 'Artesanato', cor: 'bg-[#A65E3F]', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081918.png' }
];

const TRAJETO_DB = [
  { id: 1, titulo: "Escolha", desc: "Selecione produtos frescos direto do catálogo.", Icon: MousePointerClick },
  { id: 2, titulo: "Colheita", desc: "O produtor recebe o pedido e prepara na hora.", Icon: Leaf },
  { id: 3, titulo: "Logística", desc: "Escolha entre frete rápido ou retirada local.", Icon: Truck },
  { id: 4, titulo: "Entrega", desc: "Receba em casa com garantia de origem.", Icon: PackageCheck }
];

const HISTORIAS_DB = [
  { 
    id: 1, 
    nome: "Seu João", 
    local: "Aracaju, SE", 
    perfil: "Produtor", 
    foto: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=600", 
    texto: "Desde que comecei a anunciar no site, minhas vendas dobraram. O suporte logístico me permitiu focar no que amo: cuidar da terra, sem me preocupar com atravessadores." 
  },
  { 
    id: 2, 
    nome: "Dona Maria", 
    local: "Olinda, PE", 
    perfil: "Artesã", 
    foto: "https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=600", 
    texto: "O site deu visibilidade ao meu artesanato para além da minha cidade. Hoje recebo pedidos de todo o Brasil e consigo um valor justo por cada peça produzida." 
  },
  { 
    id: 3, 
    nome: "Seu Cícero", 
    local: "Crato, CE", 
    perfil: "Apicultor", 
    foto: "https://images.pexels.com/photos/2583847/pexels-photo-2583847.jpeg?auto=compress&cs=tinysrgb&w=600", 
    texto: "Vender mel direto pela plataforma mudou nossa cooperativa. O pagamento cai direto e seguro, e os clientes elogiam a facilidade de encontrar nossos produtos." 
  },
  { 
    id: 4, 
    nome: "Dona Lindinalva", 
    local: "Ilha do Ferro, AL", 
    perfil: "Bordadeira", 
    foto: "https://images.pexels.com/photos/17392741/pexels-photo-17392741.jpeg?auto=compress&cs=tinysrgb&w=600", 
    texto: "O que antes era apenas uma venda local, agora é um negócio profissional. O site me ajudou a organizar as encomendas e a valorizar a arte do bordado nordestino." 
  }
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES_DESTAQUE.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F5F2ED]">
      
      <header className="w-full bg-white flex justify-center py-4 px-6 border-b border-gray-100 shadow-sm z-50">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <Link to="/"><img src="/assets/logo-home.png" alt="Rede Nordeste" className="h-13 max-w-[280px] object-contain antialiased transition-transform hover:scale-105 duration-300" /></Link>
          <Link to="/login" className="border-2 border-[#394158] bg-[#394158] text-white px-8 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all hover:bg-white hover:text-[#394158]">Entrar</Link>
        </div>
      </header>

      <section className="w-full relative overflow-hidden h-[450px] md:h-[550px]">
        <div className="flex h-full transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {SLIDES_DESTAQUE.map((slide) => (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative group">
              <img src={slide.img} className="w-full h-full object-cover" alt={slide.titulo} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-16 left-0 w-full flex justify-center px-6">
                <div className="w-full max-w-5xl flex flex-col items-start space-y-3">
                  <span className={`font-black uppercase tracking-[0.3em] text-[10px] md:text-xs py-1 px-3 bg-black/40 rounded-full ${slide.corDestaque}`}>{slide.tipo}</span>
                  <h2 className="font-black text-3xl md:text-5xl text-white uppercase italic leading-tight tracking-tight max-w-3xl">{slide.titulo}</h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 pt-2 w-full justify-between">
                    <p className="text-sm md:text-base text-white/80 font-medium max-w-xl">{slide.subtitulo}</p>
                    <button className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest bg-white/10 hover:bg-white/20 py-2.5 px-5 rounded-full transition-all group-hover:gap-3">Saiba Mais <ArrowRight size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {SLIDES_DESTAQUE.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white scale-150' : 'bg-white/30 hover:bg-white/60'}`} />
          ))}
        </div>
      </section>

      <main className="w-full flex flex-col items-center pt-16">
        <div className="text-center space-y-3 px-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight text-[#394158]">Conectando quem produz a quem consome</h1>
          <p className="text-sm md:text-base font-medium max-w-lg mx-auto text-[#394158]/70">A infraestrutura digital do Nordeste para o comércio de ponta a ponta.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 px-6 mb-20">
          <Link to="/cadastro" className="flex flex-col items-center justify-center bg-[#55833d] text-white border-2 border-[#55833d] p-6 w-60 rounded-[2rem] transition-all hover:bg-white hover:text-[#55833d] shadow-lg group text-center">
            <div className="flex items-center gap-2 mb-1"><Store size={18} /><span className="font-black uppercase text-sm tracking-widest">Sou vendedor</span></div>
            <span className="text-[9px] font-bold italic opacity-70">Quero anunciar meus produtos</span>
          </Link>
          <Link to="/cadastro" className="flex flex-col items-center justify-center bg-[#f9943b] text-white border-2 border-[#f9943b] p-6 w-60 rounded-[2rem] transition-all hover:bg-white hover:text-[#f9943b] shadow-lg group text-center">
            <div className="flex items-center gap-2 mb-1"><ShoppingBag size={18} /><span className="font-black uppercase text-sm tracking-widest">Sou comprador</span></div>
            <span className="text-[9px] font-bold italic opacity-70">Procuro produtos da região</span>
          </Link>
        </div>

        {/* NOSSA MISSÃO */}
        <section className="w-full py-28 flex justify-center bg-white border-b border-gray-100">
          <div className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-start space-y-6">
              <div className="flex items-center gap-3 text-[#55833d]">
                <Target size={24} strokeWidth={2.5} />
                <h2 className="font-black uppercase italic tracking-[0.2em] text-sm text-[#394158]/40">Nossa Missão</h2>
              </div>
              <h3 className="font-black text-3xl md:text-4xl text-[#394158] uppercase italic leading-tight tracking-tight">
                Por que criamos <br /> a Rede Nordeste?
              </h3>
              <div className="space-y-4 text-sm md:text-base font-medium text-[#394158]/80 leading-relaxed">
                <p>Nascemos da necessidade de valorizar o pequeno produtor e o artesão nordestino. Muitas vezes, quem produz com tanto carinho não consegue acessar o consumidor final devido às barreiras logísticas.</p>
                <p>A Rede Nordeste surge como uma ponte digital segura e justa. Queremos garantir que produtos frescos cheguem à sua mesa, fortalecendo a economia familiar.</p>
              </div>
            </div>
            <div className="w-full aspect-[4/3] bg-[#F5F2ED] rounded-[3rem] border border-gray-100 flex items-center justify-center shadow-inner group overflow-hidden">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#394158]/30 group-hover:scale-110 transition-transform">
                [ Espaço para Imagem da Missão ]
              </span>
            </div>
          </div>
        </section>

        {/* HISTÓRIAS DE SUCESSO (MODIFICADO: LADO A LADO, APENAS TRÊS) */}
        <section className="w-full flex justify-center py-24">
          <div className="w-full max-w-7xl px-6">
            <h2 className="font-black uppercase italic tracking-[0.2em] text-sm mb-12 text-[#394158]/40">Histórias de Sucesso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HISTORIAS_DB.slice(0, 3).map((hist) => (
                <div key={hist.id} className="bg-[#394158] p-8 rounded-[3rem] shadow-2xl flex flex-col gap-6 hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <img src={hist.foto} className="w-20 h-20 object-cover rounded-2xl border-2 border-white/10" alt={hist.nome} />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#C4D663]">{hist.perfil}</span>
                      <h3 className="text-xl font-black uppercase italic text-white leading-tight">{hist.nome}</h3>
                      <p className="text-[9px] font-bold uppercase opacity-50 text-white">{hist.local}</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed font-medium text-white/80">
                    "{hist.texto}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DO CAMPO À SUA MESA */}
        <section className="w-full py-24 flex justify-center">
          <div className="w-full max-w-5xl px-6 flex flex-col items-center">
            <h2 className="font-black uppercase italic tracking-[0.2em] text-sm mb-16 text-[#394158]/40 self-start">Do campo à sua mesa</h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-14 left-10 right-10 h-[2px] border-t-2 border-dashed border-[#394158]/10 -z-10"></div>
              {TRAJETO_DB.map((item) => (
                <div key={item.id} className="flex flex-col items-center text-center space-y-4 group">
                  <div className="w-20 h-20 bg-white border-2 border-[#394158]/5 rounded-3xl flex items-center justify-center shadow-xl shadow-gray-200/50 transition-all group-hover:border-[#55833d] group-hover:bg-[#55833d] group-hover:text-white group-hover:-translate-y-2">
                    <item.Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1 px-4">
                    <h4 className="font-black uppercase text-xs tracking-widest text-[#394158]">{item.titulo}</h4>
                    <p className="text-[10px] font-bold italic leading-relaxed text-[#394158]/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="w-full text-center p-10 bg-gray-50 text-[#394158]/20">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Rede Nordeste - Todos os direitos reservados.</span>
      </footer>
    </div>
  );
}