import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postsData } from "./Blog"; 
import { ArrowLeft, Calendar, Clock, Volume2, VolumeX } from 'lucide-react';

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<any>(null);
  const [isReading, setIsReading] = useState(false);

  // --- FUNÇÃO PARA CONTROLAR A VOZ (AGORA LÊ TUDO E SÓ NO CLIQUE) ---
  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        const textoParaLer = `${post.titulo}. ${post.subtitulo}. ${post.conteudo}`;
        const utterance = new SpeechSynthesisUtterance(textoParaLer);
        utterance.lang = 'pt-BR';
        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    }
  };

  useEffect(() => {
    const carregarPost = () => {
      const postId = Number(id);
      let postEncontrado = null;
      
      const salvas = localStorage.getItem('noticias_globais');
      if (salvas) {
        const parseadas = JSON.parse(salvas);
        const adminPost = parseadas.find((p: any) => p.id === postId);
        if (adminPost) {
          postEncontrado = {
            id: adminPost.id,
            titulo: adminPost.titulo,
            subtitulo: adminPost.subtitulo,
            categoria: "NOTÍCIA",
            imagem: adminPost.imagem,
            data: adminPost.data,
            leitura: adminPost.tempoLeitura || '3 min',
            conteudo: adminPost.descricao || '',
            citacao: adminPost.citacao || ''
          };
        }
      }

      if (!postEncontrado) {
        postEncontrado = postsData.find((p) => p.id === postId);
      }

      if (postEncontrado) {
        setPost(postEncontrado);
      }
    };
    
    carregarPost();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [id]);

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center font-black uppercase italic text-[#394158]">Post não encontrado!</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-sans text-[#394158]">
      
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 py-4 px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/assets/logo-home.png" alt="Logo" className="h-12 w-auto object-contain" />
          </div>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <button onClick={() => navigate('/')} className="text-[#394158] hover:text-[#55833d] transition-colors cursor-pointer">Início</button>
            <button onClick={() => navigate('/blog')} className="text-[#f9943b] cursor-pointer">Blog</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="flex justify-between items-center mb-10">
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md hover:-translate-x-1 transition-all cursor-pointer"
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft size={14} /> Voltar para o Blog
          </button>

          {/* BOTÃO PARA INICIAR/PARAR O ÁUDIO */}
          <button 
            onClick={toggleSpeech}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isReading ? 'bg-[#f9943b] text-white' : 'bg-white text-[#f9943b] border border-[#f9943b]'}`}
          >
            {isReading ? <><VolumeX size={14} /> Parar Áudio</> : <><Volume2 size={14} /> Ouvir Notícia</>}
          </button>
        </div>

        <header className="mb-10">
          <span className="inline-block bg-[#55833d] text-white text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest mb-4">
            {post.categoria}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#394158] uppercase italic leading-tight tracking-tighter mb-6">
            {post.titulo}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-[#394158]/50">
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-[#f9943b]" /> {post.data}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-[#55833d]" /> {post.leitura} de leitura
            </span>
          </div>
        </header>

        <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-white">
          <img src={post.imagem} alt={post.titulo} className="w-full h-full object-cover" />
        </div>

        <article className="space-y-8">
          <h2 className="text-2xl font-black text-[#55833d] uppercase italic leading-tight">
            {post.subtitulo}
          </h2>
          
          <div className="text-lg font-medium leading-relaxed text-[#394158]/80 space-y-6">
            {post.conteudo.split('\n').map((line: string, index: number) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          
          <div className="bg-[#f9943b]/10 border-l-4 border-[#f9943b] p-8 italic text-xl font-medium rounded-r-2xl">
            "{post.citacao || "A tecnologia não substitui o produtor, mas potencializa seu conhecimento e sua produção."}"
          </div>
        </article>

        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
             <button 
                onClick={() => navigate('/blog')}
                className="text-[#55833d] font-black uppercase text-xs border-b-2 border-[#55833d] pb-1 hover:text-[#f9943b] hover:border-[#f9943b] transition-all cursor-pointer"
             >
                Explorar mais notícias
             </button>
        </footer>
      </main>
    </div>
  );
}