import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, ShoppingBag, ArrowRight } from 'lucide-react';

// --- ESTRUTURA DE DADOS ---
const SLIDES_DESTAQUE = [
  { 
    id: 1, 
    tipo: "SAFRA DO MÊS",
    titulo: "A melhor época para comprar manga",
    subtitulo: "Produtos frescos e com preços especiais direto do produtor.",
    img: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000", 
    corDestaque: "text-[#f9943b]" // Novo Laranja
  },
  { 
    id: 2, 
    tipo: "HISTÓRIA DE SUCESSO",
    titulo: "Como o seu João dobrou a renda com a macaxeira",
    subtitulo: "Conheça a trajetória do agricultor que apostou na venda direta.",
    img: "https://images.unsplash.com/photo-1595974482597-4b8da0879d67?q=80&w=2000", 
    corDestaque: "text-[#55833d]" // Novo Verde Musgo
  },
  { 
    id: 3, 
    tipo: "PRÊMIO DE METAS ALCANÇADAS",
    titulo: "Dona Maria ganhou em primeiro lugar nas vendas de artesanato",
    subtitulo: "Valorizamos o esforço de quem leva a cultura nordestina adiante.",
    img: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2000", 
    corDestaque: "text-[#C4D663]" 
  }
];

const CATEGORIAS_DB = [
  { nome: 'Hortifruti', cor: 'bg-[#55833d]', icon: 'https://cdn-icons-png.flaticon.com/512/2329/2329903.png' }, // Novo Verde Musgo
  { nome: 'Laticínios', cor: 'bg-[#C4D663]', icon: 'https://cdn-icons-png.flaticon.com/512/2674/2674486.png' },
  { nome: 'Grãos e Farinhas', cor: 'bg-[#BC5434]', icon: 'https://cdn-icons-png.flaticon.com/512/1147/1147560.png' },
  { nome: 'Artesanato', cor: 'bg-[#A65E3F]', icon: 'https://cdn-icons-png.flaticon.com/512/3081/3081918.png' }
];

const HISTORIAS_DB = [
  {
    id: 1,
    nome: "Seu João",
    local: "Aracaju, SE",
    perfil: "Produtor",
    foto: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=600",
    texto: "Trabalho na terra desde os 12 anos. Com a Rede Nordeste, parei de depender de atravessadores e hoje levo minha produção direto para as feiras.",
  },
  {
    id: 2,
    nome: "Dona Maria",
    local: "Olinda, PE",
    perfil: "Artesã",
    foto: "https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=600",
    texto: "Minhas cestas de palha carregam a tradição da minha família. Vender aqui me deu a chance de mostrar meu artesanato para o Brasil inteiro.",
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
      
      {/* NAVBAR */}
      <header className="w-full bg-white flex justify-center py-4 px-6 border-b border-gray-100 shadow-sm z-50">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/assets/logo-home.png" 
                alt="Rede Nordeste" 
                className="h-13 max-w-[280px] object-contain antialiased transition-transform hover:scale-105 duration-300" 
              />
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              to="/login" 
              // Cor original Green (#2D3A27) -> Novo Primary Earth (#394158)
              className="border-2 border-[#394158] bg-[#394158] text-white px-8 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all hover:bg-white hover:text-[#394158]"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* CARROSSEL */}
      <section className="w-full relative overflow-hidden h-[450px] md:h-[550px]">
        <div 
          className="flex h-full transition-transform duration-1000 ease-in-out" 
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES_DESTAQUE.map((slide) => (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative group">
              <img src={slide.img} className="w-full h-full object-cover" alt={slide.titulo} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-16 left-0 w-full flex justify-center px-6">
                <div className="w-full max-w-5xl flex flex-col items-start space-y-3">
                  <span className={`font-black uppercase tracking-[0.3em] text-[10px] md:text-xs py-1 px-3 bg-black/40 rounded-full ${slide.corDestaque}`}>
                    {slide.tipo}
                  </span>
                  <h2 className="font-black text-3xl md:text-5xl text-white uppercase italic leading-tight tracking-tight max-w-3xl">
                    {slide.titulo}
                  </h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 pt-2 w-full justify-between">
                    <p className="text-sm md:text-base text-white/80 font-medium max-w-xl">
                      {slide.subtitulo}
                    </p>
                    <button className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest bg-white/10 hover:bg-white/20 py-2.5 px-5 rounded-full transition-all group-hover:gap-3">
                      Saiba Mais <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {SLIDES_DESTAQUE.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)} 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white scale-150' : 'bg-white/30 hover:bg-white/60'}`} 
            />
          ))}
        </div>
      </section>

      <main className="w-full flex flex-col items-center pt-16">
        <div className="text-center space-y-3 px-6 mb-12">
          {/* Cor original Green (#2D3A27) -> Novo Primary Earth (#394158) */}
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight text-[#394158]">
            Conectando quem produz a quem consome
          </h1>
          {/* Cor original Green (#2D3A27) -> Novo Primary Earth (#394158) */}
          <p className="text-sm md:text-base font-medium max-w-lg mx-auto text-[#394158]/70">
            A infraestrutura digital do Nordeste para o comércio de ponta a ponta.
          </p>
        </div>

        {/* BOTÕES DE PERFIL */}
        <div className="flex flex-col md:flex-row gap-6 px-6 mb-20">
          <Link to="/cadastro" 
            // Cor original Vinho (#B22246) -> Novo Verde Musgo (#55833d)
            className="flex flex-col items-center justify-center bg-[#55833d] text-white border-2 border-[#55833d] p-6 w-60 rounded-[2rem] transition-all hover:bg-white hover:text-[#55833d] shadow-lg group text-center"
          >
            <div className="flex items-center gap-2 mb-1">
              <Store size={18} />
              <span className="font-black uppercase text-sm tracking-widest">Sou vendedor</span>
            </div>
            <span className="text-[9px] font-bold italic opacity-70">Quero anunciar meus produtos</span>
          </Link>
          <Link to="/cadastro" 
            // Cor original Laranja (#F28C28) -> Novo Laranja Clay (#f9943b)
            className="flex flex-col items-center justify-center bg-[#f9943b] text-white border-2 border-[#f9943b] p-6 w-60 rounded-[2rem] transition-all hover:bg-white hover:text-[#f9943b] shadow-lg group text-center"
          >
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag size={18} />
              <span className="font-black uppercase text-sm tracking-widest">Sou comprador</span>
            </div>
            <span className="text-[9px] font-bold italic opacity-70">Procuro produtos da região</span>
          </Link>
        </div>

        {/* CATEGORIAS */}
        <section className="w-full py-16 flex justify-center border-y bg-white border-gray-100">
          <div className="w-full max-w-5xl px-6 flex flex-col items-start">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full justify-items-center">
              {CATEGORIAS_DB.map((cat, index) => (
                <div key={index} className="flex flex-col items-center group cursor-pointer space-y-3">
                  <div className={`w-20 h-20 ${cat.cor} rounded-[40%_60%_70%_30%/50%_40%_60%_50%] flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 shadow-md border border-black/5`}>
                    <img src={cat.icon} alt={cat.nome} className="w-10 h-10 object-contain brightness-0 opacity-70 transition-all group-hover:opacity-100" />
                  </div>
                  {/* Cor original Green (#2D3A27) -> Novo Primary Earth (#394158) */}
                  <span className="font-bold uppercase text-[10px] text-center tracking-widest text-[#394158]">
                    {cat.nome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HISTÓRIAS DE VIDA - FUNDO AZUL ACINZENTADO FIXO */}
        <section className="w-full flex justify-center py-20">
          <div className="w-full max-w-5xl px-6">
            {/* Cor original Green (#2D3A27) -> Novo Primary Earth (#394158) */}
            <h2 className="font-black uppercase italic tracking-[0.2em] text-lg mb-12 text-[#394158]">
              Histórias de Vida
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {HISTORIAS_DB.map((hist) => (
                <div key={hist.id} 
                  // Cor original Green (#2D3A27) -> Novo Primary Earth (#394158)
                  className="flex flex-col md:flex-row gap-6 p-8 rounded-[3rem] border transition-all shadow-xl bg-[#394158] border-transparent"
                >
                  <img 
                    src={hist.foto} 
                    className="w-full md:w-40 h-40 object-cover rounded-[2.5rem] border-2 border-white/20" 
                    alt={hist.nome} 
                  />
                  <div className="flex flex-col justify-center space-y-3">
                    <div>
                      {/* Cor original Verde limão (#C4D663) -> Mantive, pois combina com o azul acinzentado */}
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#C4D663]">
                        {hist.perfil}
                      </span>
                      <h3 className="text-xl font-black uppercase italic text-white">
                        {hist.nome}
                      </h3>
                      <p className="text-[10px] font-bold uppercase opacity-60 text-white">
                        {hist.local}
                      </p>
                    </div>
                    <p className="text-xs leading-relaxed font-medium text-white/90">
                      "{hist.texto}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full text-center p-10 bg-gray-50 text-[#394158]/20">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">© 2026 Rede Nordeste</span>
      </footer>
    </div>
  );
}